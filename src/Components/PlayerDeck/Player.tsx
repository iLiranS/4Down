import React, { useEffect, useMemo, useState } from 'react';
import Button from '../UI/Button';
import Card from '../UI/Card';
import { GiMagicHat, GiCardDiscard } from "react-icons/gi";
import { PiDetective } from "react-icons/pi";
import { card } from '../../utils/cards';
import Popup from '../UI/Popup';
import { cardType, gameCard } from '../../types/GameTypes';
import { cardNumberToString } from '../../utils/LogicFunctions';

const numbers: gameCard[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const types: cardType[] = ['diamond', 'heart', 'spade', 'club'];

const Player: React.FC<{ cards: card[], isPlayersTurn: boolean, onPlaceCard: (card: card, fakeCard?: card) => void, tableCard: card, isFirst: boolean }> = ({ cards, isPlayersTurn, onPlaceCard, tableCard, isFirst }) => {
    const [selectedCard, setSelectedCard] = useState<card | undefined>(undefined);
    const [bluffPopup, setBluffPopup] = useState(false);

    const [bluffedCard, setBluffedCard] = useState<card>(new card(2, 'club'))
    let isSelectedLegit = selectedCard ? selectedCard.number > tableCard.number : true // if card not selected - it's legit.
    if (tableCard.number === 14) isSelectedLegit = true


    // in order to update default bluffed card
    useEffect(() => {
        const num = tableCard.number === 14 ? 14 : tableCard.number + 1 as gameCard
        const type = types[Math.floor(Math.random() * 4)]
        setBluffedCard(new card(num, type));
    }, [tableCard])

    const selectCardHandler = (index: number) => {
        if (cards[index] === selectedCard) setSelectedCard(undefined);
        else setSelectedCard(cards[index]);
    };

    // will be aclled either from 'place' (if was legit) or from bluff (if wasn't legit)
    const placeCardHandler = (card: card) => {
        if (!isPlayersTurn) return;
        onPlaceCard(card);
        setSelectedCard(undefined)
    }

    const placeLegitCardHandler = () => {
        if (!selectedCard) return;
        placeCardHandler(selectedCard);
    }

    const bluffCardHandler = () => {
        setBluffPopup(true)
    }
    const submitBluffHandler = () => {
        if (!selectedCard) return
        const final_bluff_card: card = new card(bluffedCard.number, bluffedCard.color, bluffedCard.number);
        setBluffPopup(false);

        onPlaceCard(selectedCard, final_bluff_card)
        setSelectedCard(undefined)
    }

    return (
        <div className='flex flex-col relative'>

            {/* actions */}
            <ol className='grid grid-cols-[1fr_1fr]  h-fit'>
                <li className='flex justify-center'>
                    <Button disabled={!isPlayersTurn || isFirst} className='flex uppercase text-blue-200 text-xl justify-center items-center gap-2 bg-blue-400/40'> Call <PiDetective color='#98d2eb' /> </Button>

                </li>
                <li className='flex justify-center'>
                    {isSelectedLegit ?
                        <Button onClick={placeLegitCardHandler} disabled={!isPlayersTurn || !selectedCard} className='flex text-amber-50 uppercase text-xl justify-center items-center gap-2 bg-cyan-400/30'> Place <GiCardDiscard color='bg-cyan-400' /> </Button>
                        :
                        <Button onClick={bluffCardHandler} disabled={!isPlayersTurn || !selectedCard} className='flex text-orange-200 uppercase text-xl justify-center items-center gap-2 bg-orange-300/30'> Bluff <GiMagicHat color='orange' /> </Button>
                    }
                </li>
            </ol>

            {/* own deck */}
            <ol className='grid grid-cols-4 gap-3 justify-between px-2 h-full items-center'>
                {cards.map((card, index) => (
                    <li key={index}>
                        <Card
                            card={card}
                            isSelected={cards[index] === selectedCard}
                            onClick={() => selectCardHandler(index)}
                        />
                    </li>
                ))}
            </ol>
            {bluffPopup &&
                <Popup title='BLUFF MENU' onClose={() => { setBluffPopup(false) }}>
                    <form className='flex flex-col justify-between h-full' onSubmit={(e) => { e.preventDefault(); submitBluffHandler() }}>
                        <div className='flex flex-col gap-2'>
                            <label className='text-orange-400' htmlFor="numberPicker">Card Number</label>
                            <select defaultValue={bluffedCard.number} onChange={(num) => { setBluffedCard(prev => new card(parseInt(num.target.value) as gameCard, prev.color)) }} id="numberPicker" name="numberPicker">
                                {numbers.filter(num => num > tableCard.number).map(num => <option key={num + 'card'} value={num}>{cardNumberToString(num)}</option>)}
                            </select>
                            <label className='text-orange-400' htmlFor="typePicker">Type</label>
                            <select defaultValue={bluffedCard.color} onChange={(type) => { setBluffedCard(prev => new card(prev.number, type.target.value as cardType)) }} id="typePicker" name="typePicker">
                                {types.map(type => <option key={type + 'card'} value={type}>{type}</option>)}
                            </select>
                            <p className='text-orange-400 self-center'>Preview</p>
                            <Card className='w-14 self-center' card={bluffedCard} />
                        </div>


                        <Button className='flex text-orange-200 uppercase text-xl justify-center items-center gap-2 bg-orange-300/30'>Confirm <GiMagicHat color='orange' /> </Button>
                    </form>
                </Popup>}
        </div>
    );
};

export default Player;