import React, { useEffect, useMemo, useState } from 'react';
import Button from '../UI/Button';
import CardComponent from '../UI/Card';
import { GiMagicHat, GiCardDiscard } from "react-icons/gi";
import { MdOutlineHowToVote } from "react-icons/md";
import { Card, createCard } from '../../utils/cards';
import Popup from '../UI/Popup';
import { cardType, gameCard } from '../../types/GameTypes';
import { cardNumberToString } from '../../utils/LogicFunctions';

const numbers: gameCard[] = [10, 11, 12, 13, 14];
const types: cardType[] = ['diamond', 'heart', 'spade', 'club'];

const Player: React.FC<{ cards: Card[], totalPlayers: number, isPlayersTurn: boolean, onPlaceCard: (card: Card, fakeCard?: Card) => void, tableCards: Card[], isFirst: boolean, onCall: () => void }>
    = ({ cards, isPlayersTurn, onPlaceCard, tableCards, isFirst, onCall, totalPlayers }) => {
        const [selectedCard, setSelectedCard] = useState<Card | undefined>(undefined);
        const [bluffPopup, setBluffPopup] = useState(false);
        const [canPlay, setCanPlay] = useState(true)
        const tableCard = tableCards[0]
        const hasToCall = (tableCards.length === totalPlayers * 4)

        const [bluffedCard, setBluffedCard] = useState<Card>(createCard(10, 'club'))
        let isSelectedLegit = selectedCard ? selectedCard.number > tableCard.number : true // if card not selected - it's legit.
        if (tableCard.number === 14) isSelectedLegit = true


        // in order to update default bluffed card
        useEffect(() => {
            const num = tableCard.number === 14 ? 14 : tableCard.number + 1 as gameCard
            const type = types[Math.floor(Math.random() * 4)]
            setBluffedCard(createCard(num, type));
            setCanPlay(true)
        }, [tableCard])

        const selectCardHandler = (index: number) => {
            if (cards[index] === selectedCard) setSelectedCard(undefined);
            else setSelectedCard(cards[index]);
        };




        const placeLegitCardHandler = () => {
            if (!selectedCard || !isPlayersTurn) return;
            onPlaceCard(selectedCard);
            setCanPlay(false)
            setSelectedCard(undefined)
        }

        const bluffCardHandler = () => {
            setBluffPopup(true)
        }
        const submitBluffHandler = () => {
            if (!selectedCard) return
            const final_bluff_card: Card = createCard(bluffedCard.number, bluffedCard.color, bluffedCard.number);
            setBluffPopup(false);
            onPlaceCard(selectedCard, final_bluff_card)
            setSelectedCard(undefined)
            setCanPlay(false)
        }
        const callLastPlayer = () => {
            if (!isPlayersTurn) return
            onCall()
            setCanPlay(false)
        }



        return (
            <div className='flex flex-col relative backdrop-blur-md '>

                {/* actions */}

                <ol className='grid grid-cols-[1fr_1fr]'>
                    <li className='flex justify-center'>
                        <Button onClick={callLastPlayer} disabled={!isPlayersTurn || isFirst || !canPlay} className='flex uppercase text-blue-200 text-xl justify-center items-center gap-2 bg-blue-400/40 ring-2'> Call <MdOutlineHowToVote color='#98d2eb' /> </Button>

                    </li>
                    {!hasToCall &&
                        <li className='flex justify-center'>
                            {isSelectedLegit ?
                                <Button onClick={placeLegitCardHandler} disabled={!isPlayersTurn || !selectedCard || !canPlay} className='flex text-amber-50 uppercase text-xl justify-center items-center gap-2 bg-cyan-400/30 ring-2'> Place <GiCardDiscard color='bg-cyan-400' /> </Button>
                                :
                                <Button onClick={bluffCardHandler} disabled={!isPlayersTurn || !selectedCard || !canPlay} className='flex text-orange-200 uppercase text-xl justify-center items-center gap-2 bg-orange-300/30 ring-2'> Bluff <GiMagicHat color='orange' /> </Button>
                            }
                        </li>
                    }
                </ol>

                {/* own deck */}
                <ol className='grid grid-cols-4 gap-3 justify-between px-2 h-full items-center animate-[translateFromBottom_0.3s_ease-in-out_1]'>
                    {cards.map((card, index) => (
                        <li key={index}>
                            <CardComponent
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
                                <label className='text-white/40' htmlFor="numberPicker">Card Number</label>
                                <select defaultValue={bluffedCard.number} onChange={(num) => { setBluffedCard(prev => createCard(parseInt(num.target.value) as gameCard, prev.color)) }} id="numberPicker" name="numberPicker">
                                    {numbers.filter(num => num > tableCard.number).map(num => <option key={num + 'card'} value={num}>{cardNumberToString(num)}</option>)}
                                </select>
                                <label className='text-white/40' htmlFor="typePicker">Type</label>
                                <select defaultValue={bluffedCard.color} onChange={(type) => { setBluffedCard(prev => createCard(prev.number, type.target.value as cardType)) }} id="typePicker" name="typePicker">
                                    {types.map(type => <option key={type + 'card'} value={type}>{type}</option>)}
                                </select>
                                <p className='text-white/40 self-center'>Preview</p>
                                <CardComponent className='w-14 self-center' card={bluffedCard} />
                            </div>


                            <Button className='flex text-orange-200 uppercase text-xl justify-center  items-center gap-2 bg-black/40 ring-2 ring-orange-300'>Confirm <GiMagicHat color='orange' /> </Button>
                        </form>
                    </Popup>}
            </div>
        );
    };

export default Player;