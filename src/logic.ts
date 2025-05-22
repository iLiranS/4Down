import type { PlayerId, Players, RuneClient } from "rune-sdk"
import { gameCard, GameState, PlayerType } from "./types/GameTypes"
import { card, deck } from "./utils/cards"
import { shuffleArray } from "./utils/LogicFunctions"

export type Cells = (PlayerId | null)[]

type GameActions = {
  placeCard: (params: { card: card, fakeCard?: card }) => void,
  lostRound: (playerId: string) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

const defaultCard: card = new card(10, 'club') // won't be used just for error handling



const initializePlayers = (ids: PlayerId[], startingDeck: deck): PlayerType[] => {
  const playersArr: PlayerType[] = [];
  for (let i = 0; i < ids.length; i++) {
    const cards: card[] = [];
    for (let j = 0; j < 4; j++) {
      const tmpCard = startingDeck.pull();
      cards[j] = tmpCard !== undefined ? tmpCard : defaultCard;
    }
    playersArr[i] = {
      id: ids[i],
      down_count: 0,
      isAlive: true,
      cards
    };
  }
  console.log(playersArr);
  return playersArr;
};

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (allPlayerIds) => {
    const startingDeck = new deck();
    console.log(startingDeck)
    const allPlayerIdsShuffled = shuffleArray(allPlayerIds)

    return {
      players: initializePlayers(allPlayerIdsShuffled, startingDeck),
      deckCards: startingDeck, // will be overriten with new one every round
      activePlayerId: allPlayerIdsShuffled[Math.floor(Math.random() * allPlayerIdsShuffled.length)],
      cardsHistory: [startingDeck.firstCardOnTable() ?? new card(7, 'club')] // 7 diamond will never happend
    }
  },
  actions: {
    placeCard(params, actionContext) {
      const { game } = actionContext
      const { card, fakeCard } = params
      // check if last was an "Ace" and fake, if so current user has lost.
      if (game.cardsHistory[0].fake_val === 14) {
        // rip
        this.lostRound(game.activePlayerId, actionContext)
      }

      //TODO: if only 1 player left with cards - I will make it so he has to "call" so no problem here
      //TODO: Fake - currently I only added Ace functionality.
      //TODO: round lossing.
      //TODO: Simple AI to play against -> if he has 3 valid and 1 bluff -> 25% to bluff ... 

      // update table history with fake/real card
      const updatedHistory = [fakeCard ?? card, ...game.cardsHistory]
      game.cardsHistory = updatedHistory

      // remove the placed card from the activate player
      const id_map = game.players.map(player => player.id);
      const playerIndex = id_map.indexOf(game.activePlayerId)
      const playerCards = game.players[playerIndex].cards
      const cardIndex = playerCards.indexOf(card);
      game.players[playerIndex].cards = [...playerCards].toSpliced(cardIndex, 1);

      // new player turn - skip while hand is empty is actually not necessery because each player has to get rid of exactly 1 card each turn.
      let newPlayerIndex = (playerIndex + 1) % game.players.length
      let new_player_id = game.players[newPlayerIndex].id
      game.activePlayerId = new_player_id

    },
    lostRound(params, actionContext) {
      console.log("test")
    },
  },
})

