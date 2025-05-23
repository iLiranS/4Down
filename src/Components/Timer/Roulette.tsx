import React, { useEffect, useState } from 'react';
import { loseAnimation, playerTableInfo } from '../../types/GameTypes';
import 'react-circular-progressbar/dist/styles.css';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';


const Roulette: React.FC<{ loseAnimation: loseAnimation, onFinishAnimation: () => void, player: playerTableInfo }> = ({ loseAnimation, onFinishAnimation, player }) => {
    const { rotateValue, successRate } = loseAnimation;
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
                onFinishAnimation()
            }, 3000); // match transition duration
        }, 100); // slight delay to trigger transition
        return () => clearTimeout(timeout);
    }, [finalDegree, isSuccess]);

    return (
        <div className="w-full pt-8 relative overflow-hidden">
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
            {result !== 'Spinning...' && <div className='text-3xl flex items-center gap-2 justify-center h-14 uppercase text-center pt-4 animate-[translateFromBottom_1s_ease_1]'>
                <img src={player.image} alt={player.name} className='h-full aspect-square rounded-full' />
                <p>{result}</p>
            </div>}
        </div>
    );
};

export default Roulette;