import type { PlayerId, RuneClient } from "rune-sdk"
import { GameState, PlayerType } from "./types/GameTypes"
import { Card, createCard, createDeck, firstCardOnTable, pullCard } from "./utils/cards"
import { getSuccessRate, givePlayerCards, initializePlayers, shuffleArray } from "./utils/LogicFunctions"

export type Cells = (PlayerId | null)[]

type GameActions = {
  placeCard: (params: { card: Card, fakeCard?: Card }) => void,
  lostRound: (params: { userId: string, msg: string }) => void
  addReady: () => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 4,
  setup: (allPlayerIds) => {
    const startingDeck = createDeck();
    const allPlayerIdsShuffled = shuffleArray(allPlayerIds)

    return {
      players: initializePlayers(allPlayerIdsShuffled, startingDeck),
      deckCards: startingDeck, // will be overriten with new one every round
      activePlayerId: allPlayerIdsShuffled[Math.floor(Math.random() * allPlayerIdsShuffled.length)],
      cardsHistory: [firstCardOnTable(startingDeck) ?? createCard(10, 'club')], // 7 diamond will never happend
      lastTurnPlayerId: undefined
    }
  },
  actions: {
    placeCard(params, actionContext) {
      const { game } = actionContext
      const { card, fakeCard } = params

      // update table history with fake/real card
      const updatedHistory = [fakeCard ?? card, ...game.cardsHistory]
      game.cardsHistory = updatedHistory

      // remove the placed card from the activate player
      const id_map = game.players.map(player => player.id);
      const playerIndex = id_map.indexOf(game.activePlayerId)
      const playerCards = game.players[playerIndex].cards

      // Find the actual card that was selected (not the bluffed card)
      const cardToRemove = card;
      const cardIndex = playerCards.findIndex(c =>
        c.number === cardToRemove.number &&
        c.color === cardToRemove.color
      );

      if (cardIndex === -1) {
        console.error("Card not found in player's hand");
        return;
      }

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
    lostRound(params, { game }) {
      const { userId, msg } = params
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
        rotateValue: Math.floor(Math.random() * 101), // random number between 0 and 100 inclusive
        msg
      }
      // new game would geenrate upon addReady meet it's requirments

    },
    addReady(params, { game }) {
      // this will be called from each client after lost animation is finished.
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
      const new_deck = createDeck();
      for (let i = 0; i < game.players.length; i++) {
        game.players[i].cards = givePlayerCards(new_deck);
      }

      const startingCard = firstCardOnTable(new_deck)
      game.cardsHistory = [startingCard as Card] // reset history
      game.lastTurnPlayerId = undefined;
      game.loseAnimation = undefined
    },
  },
})

