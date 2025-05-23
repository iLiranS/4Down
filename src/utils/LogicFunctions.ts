import { gameCard } from "../types/GameTypes";
import { card, deck } from "./cards";

export const shuffleArray = <T>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export const cardNumberToString = (num: gameCard) => {
    if (num === 14) return 'A'
    if (num === 13) return 'K'
    if (num === 12) return 'Q'
    if (num === 11) return 'J'
    return num
}

export const givePlayerCards = (deck: deck): card[] => {
    const cards = []
    for (let i = 0; i < 4; i++) {
        const tmpCard = deck.pull();
        cards[i] = tmpCard !== undefined ? tmpCard : new card(10, 'club'); // will never happen just typesafe.
    }
    return cards;
}

export const getSuccessRate = (down_count: number) => {
    switch (down_count) {
        case 1:
            return 75;
        case 2:
            return 50
        case 3:
            return 25
        default:
            return 0
    }
}

export const generateRandoLostText = () => {
    const texts = [
        'You fought well, challenger. The table will miss you.',
        'Eliminated… but never forgotten. GG!',
        "Out of luck, but full of heart. See you next game!",
        "The game ends, but your story doesn't. Well played!",
        "Luck fades, but skill stays. Come back stronger!",
        "Defeat today, victory tomorrow. Thanks for playing!",
        "Your seats empty, but your presence lingers. GG!",
        "You've fallen… but heroes always return. Rematch?",
        "The deck has spoken. Time to regroup and replay!",
        "Bluffed one too many? Happens to the best of us!",
        "You’re out… but hey, style points: 10/10!",
        "The cards were sus. You did your best.",
        "No cards, no problem. You still looked cool.",
        "Folded? Nah, you went out with flair.",
        "The table grows quiet. A warrior has fallen.",
        "With honor, you’ve left the table. Until next time.",
        "Turns out, bluffing is an art.",
        "Guess the cards had other plans. Brutal."
    ]
    return texts[Math.floor(Math.random() * texts.length)]

}