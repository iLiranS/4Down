import { useEffect, useState } from "react"

import selectSoundAudio from "./assets/select.wav"
import Table from "./Components/Table/Table.tsx"
import Player from "./Components/PlayerDeck/Player.tsx"
import { GameState, PlayerType } from "./types/GameTypes.ts"
import TopContainer from "./Components/Timer/TopContainer.tsx"
import { card } from "./utils/cards.ts"

const selectSound = new Audio(selectSoundAudio)

function App() {
  const [game, setGame] = useState<GameState>()
  const [yourPlayerId, setYourPlayerId] = useState<string | undefined>()
  const [currentPlayer, setCurrentPlayer] = useState<PlayerType | undefined>();
  // set currentPlayer -> be Player[] and is set to game.players[?] so that players[?].id == yourPlayerId

  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, action, yourPlayerId }) => {
        setYourPlayerId(yourPlayerId)
        setGame(game)
        const player = game.players.find(player => player.id === yourPlayerId)
        setCurrentPlayer(player);

        if (action && action.name === 'placeCard') selectSound.play()
      },
    })
  }, [])

  if (!game) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return
  }

  // can be either real or fake, check on server
  const placeCardHandler = (card: card, fakeCard?: card) => {
    if (fakeCard) Rune.actions.placeCard({ card, fakeCard })
    else Rune.actions.placeCard({ card })
  }



  return (
    <main className="grid grid-rows-[1fr_5fr_3fr] h-full relative gap-1">
      <TopContainer />

      <Table players={game.players} cardHistory={game.cardsHistory} playerId={currentPlayer?.id} turn={game.activePlayerId} />

      {currentPlayer &&
        <Player tableCard={game.cardsHistory[0]} isFirst={game.cardsHistory.length === 1} onPlaceCard={placeCardHandler} isPlayersTurn={game.activePlayerId === yourPlayerId} cards={currentPlayer.cards} />
      }

    </main>
  )
}

export default App
