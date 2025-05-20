import type { PlayerId, Players, RuneClient } from "rune-sdk"
import { GameState, PlayerType } from "./types/GameTypes"
import { card, deck } from "./utils/cards"

export type Cells = (PlayerId | null)[]

type GameActions = {
  claimCell: (cellIndex: number) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

const defaultCard: card = new card(10, 'club') // won't be used just for error handling

const initializePlayers = (ids: PlayerId[], startingDeck: deck): PlayerType[] => {
  const playersArr: PlayerType[] = [];
  for (let i = 0; i < ids.length; i++) {

    const cards: card[] = []

    for (let i = 0; i < 4; i++) {
      const tmpCard = startingDeck.pull();
      cards[i] = tmpCard !== undefined ? tmpCard : defaultCard;
    }
    playersArr[i] = {
      id: ids[i],
      down_count: 0,
      isAlive: true,
      cards
    }
  }
  console.log(playersArr)
  return playersArr
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (allPlayerIds) => {
    const startingDeck = new deck();
    console.log(startingDeck)

    return {
      players: initializePlayers(allPlayerIds, startingDeck),
      deckCards: startingDeck, // will be overriten with new one every round
      activePlayerId: allPlayerIds[Math.floor(Math.random() * allPlayerIds.length)],
      cardsHistory: [new card(10, 'club'), new card(12, 'spade'), new card(8, 'diamond')]
    }
  },
  actions: {
    claimCell(params, actionContext) {

    },
  },
})

