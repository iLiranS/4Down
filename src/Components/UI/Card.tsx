import React from 'react';
import { Card } from '../../utils/cards';
import { cardType } from '../../types/GameTypes';
import { LuDiamond, LuHeart, LuClub, LuSpade } from "react-icons/lu";
import { twMerge } from 'tailwind-merge';


interface CardProps {
    card: Card;
    isSelected?: boolean;
    onClick?: () => void;
    className?: string;
}

const CardComponent: React.FC<CardProps> = ({ card, isSelected, onClick, className = '' }) => {
    let cardText: string = card.number.toString()

    switch (card.number) {
        case 14:
            cardText = 'A'
            break
        case 11:
            cardText = 'J'
            break
        case 12:
            cardText = 'Q'
            break
        case 13:
            cardText = 'K'
            break
    }
    const getSuitSymbol = (type: cardType) => {
        switch (type) {
            case 'heart': return <LuHeart />;
            case 'diamond': return <LuDiamond />;
            case 'club': return <LuClub />;
            case 'spade': return <LuSpade />;
        }
    };

    const getColorFromSymbol = (symbol: cardType) => {
        if (symbol == 'heart' || symbol == 'diamond') return 'red'
        return 'black'
    }


    return (
        <div
            onClick={onClick}
            className={twMerge(`
        relative w-full aspect-[2/3] bg-amber-50 rounded-lg p-0.5
        grid grid-rows-[1fr_1fr]
        outline-2 outline-black transition-all cursor-pointer
        ${isSelected ? 'ring-4 ring-blue-500 -translate-y-2' : ''}
        ${className}
      `)}
        >
            {/* Top number and suit */}
            <div style={{ color: getColorFromSymbol(card.color) }} className={`text-xl leading-5 font-bold`}>
                <div>{cardText}</div>
            </div>

            {/* Center suit */}
            <div style={{ color: getColorFromSymbol(card.color) }} className={`items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center text-3xl`}>
                {getSuitSymbol(card.color)}
            </div>

            {/* Bottom number and suit (inverted) */}
            <div style={{ color: getColorFromSymbol(card.color) }} className={`rotate-180 leading-4 text-xl font-bold`}>
                <div>{cardText}</div>
            </div>
        </div>
    );
};

export default CardComponent;