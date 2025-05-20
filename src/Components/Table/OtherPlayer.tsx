import React from 'react'
import { playerTableInfo } from '../../types/GameTypes'
import CardCover, { cardPosition } from '../UI/CardCover'


const OtherPlayer: React.FC<{ orderIndex: number, playerTableInfo: playerTableInfo }> = ({ orderIndex, playerTableInfo }) => {
    // Add safety check at the beginning
    if (!playerTableInfo) {
        return null;
    }

    if (playerTableInfo.isEmpty) {
        return (
            <section className={`
                relative 
                ${orderIndex === 1 ? 'h-16 flex-row w-full' : 'w-16 flex-col h-full'} 
                flex
            `}>
            </section>
        );
    }
    // cards visualizaiton
    let cardPosition: cardPosition = 'front';
    if (orderIndex === 0) cardPosition = 'left'
    if (orderIndex === 2) cardPosition = 'right'

    const getCardStyle = (index: number) => {
        const baseStyle: React.CSSProperties = {
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%'
        };

        if (cardPosition === 'front') {
            return {
                ...baseStyle,
                left: `calc(50% + ${index * 8}px)`,
            };
        }
        if (cardPosition === 'left' || cardPosition === 'right') {
            return {
                ...baseStyle,
                top: `calc(50% + ${index * 8}px)`,
            };
        }
        return baseStyle;
    };

    const cardsMapped = Array.from({ length: playerTableInfo.cardCount }, (_, index) => (
        <CardCover
            key={index}
            className='absolute'
            position={cardPosition}
            isFirst={index === 0}
            style={getCardStyle(index)}
        />
    ));

    return (
        <section className={`relative grid  self-center w-full h-full`}>
            <div className={`flex ${orderIndex === 2 && 'flex-row-reverse pr-1'} ${orderIndex === 0 && 'pl-1'} relative ${orderIndex === 1 && 'flex-col'} `}>

                <div className={`flex items-center w-10 self-center`}>
                    <img className={`rounded-full aspect-square ${orderIndex === 1 ? 'h-full' : 'w-full'} ${playerTableInfo.isTurn && 'ring-yellow-400 ring-2'}`} src={playerTableInfo.image} alt={playerTableInfo.name} />
                </div>
                <div className='relative flex-auto'>
                    {cardsMapped}
                </div>
            </div>
        </section>
    )
}

export default OtherPlayer