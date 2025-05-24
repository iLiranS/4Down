import { useEffect, useState } from "react"

import selectSoundAudio from "./assets/select.wav"
import flip_card_audio from './assets/flip_card.wav'
import Table from "./Components/Table/Table.tsx"
import Player from "./Components/PlayerDeck/Player.tsx"
import { GameState, PlayerType } from "./types/GameTypes.ts"
import TopContainer from "./Components/Timer/TopContainer.tsx"
import { card } from "./utils/cards.ts"
import { generateRandoLostText } from "./utils/LogicFunctions.ts"

const selectSound = new Audio(flip_card_audio)

function App() {
  const [game, setGame] = useState<GameState>()
  const [yourPlayerId, setYourPlayerId] = useState<string | undefined>()
  const [currentPlayer, setCurrentPlayer] = useState<PlayerType | undefined>();
  const [loseText, setLoseText] = useState(generateRandoLostText())


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
    // check if previous card was Ace and fake - means current lost
    const lastCard = game.cardsHistory[0];
    if (lastCard.number === 14 && lastCard.fake_val) {
      // lost due to last ace was fake.
      Rune.actions.lostRound({ userId: game.activePlayerId, msg: 'last Ace was fake!' })
      return
    }
    if (fakeCard) Rune.actions.placeCard({ card, fakeCard })
    else Rune.actions.placeCard({ card })
  }

  const callLieHandler = () => {
    if (game.cardsHistory[0].fake_val) {
      // means it was indeed lie and prev player has lost
      const lastTurnPlayerId = game.lastTurnPlayerId
      if (!lastTurnPlayerId) return
      Rune.actions.lostRound({ userId: lastTurnPlayerId, msg: 'Been caught as a liar!' })
    }
    else {
      // the last card was not a lie and current lost
      Rune.actions.lostRound({ userId: game.activePlayerId, msg: 'Last card was legit !' })
    }
  }



  return (
    <main className="grid grid-rows-[1fr_5fr_3fr] h-full relative gap-1 overflow-hidden">
      <TopContainer loseAnimation={game.loseAnimation} currentPlayerId={yourPlayerId ?? ''} />

      <Table players={game.players} cardHistory={game.cardsHistory} playerId={currentPlayer?.id} turn={game.activePlayerId} />

      {currentPlayer && !game.loseAnimation?.active &&

        <>
          {currentPlayer.isAlive ?
            <Player onCall={callLieHandler} totalPlayers={game.players.length} tableCards={game.cardsHistory} isFirst={game.cardsHistory.length === 1} onPlaceCard={placeCardHandler} isPlayersTurn={game.activePlayerId === yourPlayerId} cards={currentPlayer.cards} />
            :
            <p className="text-xl font-serif self-end text-center pb-4">{loseText}</p>

          }
        </>

      }

    </main>
  )
}

export default App
