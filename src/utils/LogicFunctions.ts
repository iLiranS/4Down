import { gameCard } from "../types/GameTypes";

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