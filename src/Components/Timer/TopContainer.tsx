import React, { useEffect, useState } from 'react'
import Popup from '../UI/Popup';
import { FaRegQuestionCircle } from "react-icons/fa";
const TopContainer = () => {
    const [showFAQ, setShowFAQ] = useState(false);




    return (
        <div className='flex justify-between items-center px-2'>
            <p>00:00</p>
            <div className='cursor-pointer text-xl' onClick={() => { setShowFAQ(true) }}>
                <FaRegQuestionCircle />
            </div>
            {showFAQ &&
                <Popup title='FAQ' onClose={() => { setShowFAQ(false) }}>
                    <ul className='list-decimal text-sm gap-2 flex flex-col pl-2'>
                        <li>Each player gets random 4 cards</li>
                        <li>The goal is to get rid of them without being caught as a liar.</li>
                        <li>survive chance: 75% → 50% → 25% → 0%</li>
                        <li>You have to place a card higher than the current one on the table.</li>
                        <li>"Ace" on the table means next player can place any card, but <span className='font-bold'>if the "Ace" was fake</span>,if next player took action, he is "caught".</li>
                        <p className='text-red-400'>Mechanics <span className='text-gray-400'>(in your turn)</span></p>
                        <p><span className='text-blue-400'>CALL</span> - call the previous player as a liar.</p>
                        <p><span className='text-orange-300'>BLUFF</span> - "camouflage" selected card as a different desired one </p>
                        <p className='mt-4 self-center'>Have Fun 🙃</p>
                        <p className='text-sm text-gray-400 self-center'> ~iLiranS~</p>
                    </ul>
                </Popup>}
        </div>
    )
}

export default TopContainer