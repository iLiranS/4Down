import React, { useEffect, useState } from 'react';
import { loseAnimation, playerTableInfo } from '../../types/GameTypes';
import 'react-circular-progressbar/dist/styles.css';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import sound_effect from '../../assets/fail.wav'


const Roulette: React.FC<{ loseAnimation: loseAnimation, onFinishAnimation: () => void, player: playerTableInfo }> = ({ loseAnimation, onFinishAnimation, player }) => {
    const { rotateValue, successRate } = loseAnimation;
    const sound = new Audio(sound_effect)
    sound.volume = 0.5
    const [degree, setDegree] = useState(0);
    const [result, setResult] = useState<string>('Spinning...');
    const [isSpinning, setIsSpinning] = useState(true);

    // Calculate where the pointer (top center) should land
    // 0 = top center, 360 = full circle
    // rotateValue is the "random" result (0-100)
    // The pointer should land at the rotateValue's position
    // Add extra spins for effect
    const finalDegree = 5 * 360 + (rotateValue / 100) * 360;

    const isSuccess = rotateValue <= successRate;


    useEffect(() => {
        // Animate spin
        setDegree(0);
        const timeout = setTimeout(() => {
            setDegree(finalDegree);
            setTimeout(() => {
                setIsSpinning(false);
                setResult(isSuccess ? 'Safe 👾' : "Lost 🪦");
                if (!isSuccess) sound.play()
                onFinishAnimation()
            }, 3000); // match transition duration
        }, 100); // slight delay to trigger transition
        return () => clearTimeout(timeout);
    }, [finalDegree, isSuccess]);

    if (!player) return <></>

    return (
        <div className="w-full h-full pt-8 relative overflow-hidden">
            <div className="absolute left-1/2 top-2 -translate-x-1/2 z-10">▼</div>
            <div
                style={{
                    transform: `rotate(${degree}deg)`,
                    transition: 'transform 3s cubic-bezier(0.23, 1, 0.32, 1)',
                }}
                className='overflow-hidden w-full'
            >
                <CircularProgressbar
                    className="rounded-full aspect-square w-full roulette"
                    value={successRate}
                    maxValue={100}
                    styles={buildStyles({
                        pathColor: '#2ecc71',
                        trailColor: '#e74c3c',
                        rotation: 0, // 0.75 = start at top center, counterclockwise
                        pathTransition: 'none', // disable CPB's own animation
                    })}
                    counterClockwise
                />
            </div>
            <div className=' flex items-center justify-center uppercase text-center pt-4 '>
                <img src={player.image} alt={player.name} className='h-10 aspect-square rounded-full' />
            </div>
            <div className='flex w-full justify-center'>
                {result !== 'Spinning...' ? <p className='animate-[translateFromBottom_1s_ease_1] w-full text-center'>{result}</p> : <p className='animate-pulse w-full text-center'>...</p>}
            </div>
            <p className='absolute bottom-2 left-0 text-center w-full font-serif'>{loseAnimation.msg}</p>
        </div>
    );
};

export default Roulette;