import type { PlayerId, Players, RuneClient } from "rune-sdk"
import { gameCard, GameState, playerTableInfo, PlayerType } from "./types/GameTypes"
import { card, deck } from "./utils/cards"
import { getSuccessRate, givePlayerCards, shuffleArray } from "./utils/LogicFunctions"

export type Cells = (PlayerId | null)[]

type GameActions = {
  placeCard: (params: { card: card, fakeCard?: card }) => void,
  lostRound: (playerid: string) => void
  addReady: () => void
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
  return playersArr;
};

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (allPlayerIds) => {
    const startingDeck = new deck();
    const allPlayerIdsShuffled = shuffleArray(allPlayerIds)

    return {
      players: initializePlayers(allPlayerIdsShuffled, startingDeck),
      deckCards: startingDeck, // will be overriten with new one every round
      activePlayerId: allPlayerIdsShuffled[Math.floor(Math.random() * allPlayerIdsShuffled.length)],
      cardsHistory: [startingDeck.firstCardOnTable() ?? new card(7, 'club')], // 7 diamond will never happend
      lastTurnPlayerId: undefined
    }
  },
  actions: {
    placeCard(params, actionContext) {
      const { game } = actionContext
      const { card, fakeCard } = params

      //TODO: if only 1 player left with cards - I will make it so he has to "call" so no problem here
      //TODO: Simple AI to play against -> if he has 3 valid and 1 bluff -> 25% to bluff ... 
      //TODO: EMOTES chat ! (if have time)

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
      let loopCount = 0;
      while (!game.players[newPlayerIndex].isAlive) {
        newPlayerIndex = (newPlayerIndex + 1) % game.players.length
        loopCount++;
        if (loopCount > game.players.length) {
          throw new Error("No alive players found");
        }
      }

      let new_player_id = game.players[newPlayerIndex].id
      game.lastTurnPlayerId = game.activePlayerId
      game.activePlayerId = new_player_id

    },
    lostRound(userId, { game }) {
      const id_map = game.players.map(player => player.id);
      const playerIndex = id_map.indexOf(userId)
      const player = game.players[playerIndex]
      console.log("player with id : " + player.id + " has lost the round")
      const new_down_count = game.players[playerIndex].down_count + 1;
      game.players[playerIndex].down_count += 1;

      // before new round I want to have the mini game or an indicator of what happend
      game.loseAnimation = {
        active: true,
        playerId: userId,
        successRate: getSuccessRate(new_down_count),
        readyCount: 0,
        rotateValue: Math.floor(Math.random() * 101) // random number between 0 and 100 inclusive
      }
      // new game would geenrate upon addReady meet it's requirments

    },
    addReady(params, { game }) {
      // this wil be called from each client after lost animation is finished.
      if (!game.loseAnimation) return;
      const new_r_count = game.loseAnimation.readyCount + 1;
      if (new_r_count < game.players.length - 1) {
        game.loseAnimation.readyCount += 1;
        return;
      }

      // finished animation
      const hasSurvived = game.loseAnimation.rotateValue <= game.loseAnimation.successRate
      let player;
      // set him as not alive if lost
      if (!hasSurvived) {
        player = game.players.find(player => player.id === game.loseAnimation?.playerId);
        if (player) {
          player.isAlive = false;
        }
      }

      // new starting player - would be either lost previous or random if game over for him
      if (!hasSurvived) {
        const alivePlayers = game.players.filter(player => player.isAlive);
        if (alivePlayers.length === 1) {
          // we have a winner
          const lostPlayers = game.players.filter(player => player.isAlive === false).map(player => player.id)
          const results: Record<string, "WON" | "LOST"> = {
            [alivePlayers[0].id]: "WON",
          };
          lostPlayers.forEach(id => {
            results[id] = "LOST";
          });
          Rune.gameOver({
            players: results,
          })
        }
        game.activePlayerId = alivePlayers[Math.floor(Math.random() * alivePlayers.length)].id
      }
      else {
        game.activePlayerId = game.loseAnimation?.playerId ?? ''
      }
      // new deck
      const new_deck = new deck();
      for (let i = 0; i < game.players.length; i++) {
        game.players[i].cards = givePlayerCards(new_deck);
      }

      const startingCard = new_deck.firstCardOnTable();
      game.cardsHistory = [startingCard as card] // reset history
      game.lastTurnPlayerId = undefined;
      game.loseAnimation = undefined
    },
  },
})

