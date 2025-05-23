import React from 'react'

const FAQ = () => {
    return (
        <ul className='text-sm gap-2 flex flex-col list-none'>
            <li>Each player gets random 4 cards out of a legit deck.</li>
            <li>The goal is to get rid of them without being caught as a liar.</li>
            <li>You have to place a card higher than the current one on the table.</li>
            <li>"Ace" on the table means next player can place any card, but <span className='font-bold'>if the "Ace" was fake</span>,if next player took action, he is "caught".</li>
            <li>survive chances decreased after being caught : 75% → 50% → 25% → 0%</li>
            <section className='h-[1px] w-full bg-white/20'></section>
            <p><span className='text-blue-400'>CALL</span> - call the previous player as a liar.</p>
            <p><span className='text-orange-300'>BLUFF</span> - "camouflage" invalid card as a different desired one </p>
            <p className='mt-4 self-center'>Have Fun 🙃</p>
            <p className='text-sm text-gray-400 self-center'> ~iLiranS~</p>
        </ul>
    )
}

export default FAQ