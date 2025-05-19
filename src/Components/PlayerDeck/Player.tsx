import React, { useState } from 'react';
import Button from '../UI/Button';
import Card from '../UI/Card';
import { GiMagicHat } from "react-icons/gi";
import { PiDetective } from "react-icons/pi";
import { card } from '../../utils/cards';


const Player: React.FC<{ cards: card[], isPlayersTurn: boolean }> = ({ cards, isPlayersTurn }) => {
    const [selectedCard, setSelectedCard] = useState<number | undefined>(undefined);

    const selectCardHandler = (index: number) => {
        if (index === selectedCard) setSelectedCard(undefined);
        else setSelectedCard(index);
    };

    return (
        <div className='flex flex-col relative'>

            {/* actions */}
            <ol className='flex justify-evenly h-fit'>
                <li>
                    <Button disabled={!isPlayersTurn} className='flex uppercase text-blue-200 text-xl justify-center items-center gap-2 bg-blue-400/40'> Call <PiDetective color='#98d2eb' /> </Button>
                </li>
                <li>
                    <Button disabled={!isPlayersTurn || !selectedCard} className='flex text-orange-200 uppercase text-xl justify-center items-center gap-2 bg-orange-300/30'> Bluff <GiMagicHat color='orange' /> </Button>
                </li>
            </ol>

            {/* own deck */}
            <ol className='grid grid-cols-4 gap-3 justify-between px-2 h-full items-center'>
                {cards.map((card, index) => (
                    <li key={index}>
                        <Card
                            card={card}
                            isSelected={index === selectedCard}
                            onClick={() => selectCardHandler(index)}
                        />
                    </li>
                ))}
            </ol>

        </div>
    );
};

export default Player;