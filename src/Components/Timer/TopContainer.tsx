import React, { useEffect, useState } from 'react'
import Popup from '../UI/Popup';
import { FaRegQuestionCircle, FaSkull } from "react-icons/fa";
import useGameStore from '../../utils/useStore';
import your_turn_sound from "../../assets/yourturn.mp3"
import flip_cards from '../../assets/flip_card.wav'
import { loseAnimation, playerTableInfo } from '../../types/GameTypes';
import FAQ from './FAQ';
import Roulette from './Roulette';


const TopContainer: React.FC<{ currentPlayerId: string, loseAnimation: loseAnimation | undefined }> = ({ currentPlayerId, loseAnimation }) => {
    const [showFAQ, setShowFAQ] = useState(false);
    const players = useGameStore((state) => state.players);
    const currentPlayer = players.find(player => player.id === currentPlayerId)
    const currentTurnPlayer = players.filter(player => player.isTurn)[0]
    const selectSound = new Audio(your_turn_sound)
    const newRoundSound = new Audio(flip_cards);
    const [caughtPlayer, setCaughtPlayer] = useState<playerTableInfo | undefined>(undefined);



    let nameVal = '';
    if (currentTurnPlayer) {
        if (currentTurnPlayer.id === currentPlayerId) {
            nameVal = 'Your'
        }
        else nameVal = currentTurnPlayer.name
    }
    const yourDownTime = currentPlayer ? currentPlayer.down_count : 0
    let color = 'white'
    if (yourDownTime === 1) color = 'yellow'
    if (yourDownTime === 2) color = 'orange'
    if (yourDownTime === 3) color = 'red'

    useEffect(() => {
        const currentTurnPlayer = players.filter(player => player.isTurn)[0]
        if (!currentPlayer) return
        if (currentTurnPlayer.id === currentPlayerId) {
            selectSound.play()
        }

    }, [players])

    useEffect(() => {
        if (loseAnimation) {
            const { playerId } = loseAnimation
            setCaughtPlayer(players.find(player => player.id === playerId))
        }
    }, [loseAnimation])

    const finishAnimationHandler = () => {
        // just in case timeout so players can see results clearly
        setTimeout(() => {
            Rune.actions.addReady()
        }, 1000);

    }

    return (
        <div className={`flex justify-between items-center px-2`}>
            <section key={nameVal} className='items-center gap-2 flex animate-[transformIn.2s_ease-in-out]'>
                {currentTurnPlayer &&
                    <img className='h-6 aspect-square rounded-full' src={currentTurnPlayer.image} alt={currentTurnPlayer.name + '_img'}></img>
                }
                <p className='text-sm text-yellow-400 font-semibold'>{nameVal} <span className='opacity-70 text-white'>turn</span></p>

            </section>
            <div className='cursor-pointer text-xl' onClick={() => { setShowFAQ(true) }}>
                <section className='flex items-center gap-2'>
                    <div style={{ color }} className={`flex items-center gap-1 text-sm`}>
                        <p className='tracking-wider'>{yourDownTime}/4</p>
                        <FaSkull />
                    </div>
                    <FaRegQuestionCircle />
                </section>
            </div>
            {showFAQ &&
                <Popup title='FAQ' onClose={() => { setShowFAQ(false) }}>
                    <FAQ />
                </Popup>}

            {loseAnimation &&
                <Popup closable={false} title={` ${caughtPlayer?.id === currentPlayer?.id ? 'You' : caughtPlayer?.name} lost the round`}>
                    <Roulette player={caughtPlayer as playerTableInfo} onFinishAnimation={finishAnimationHandler} loseAnimation={loseAnimation} />
                </Popup>}
        </div>
    )
}

export default TopContainer