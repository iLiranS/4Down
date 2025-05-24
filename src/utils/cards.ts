import { cardType, gameCard } from "../types/GameTypes";

export interface Card {
    number: gameCard;
    color: cardType;
    fake_val?: gameCard;
    toString: () => string;
}


export const createCard = (number: gameCard, color: cardType, fake_val?: gameCard): Card => ({
    number,
    color,
    fake_val,
});

export const createDeck = (): Card[] => {
    const cards: Card[] = [];
    const colors: cardType[] = ['diamond', 'heart', 'spade', 'club'];
    const numbers: gameCard[] = [10, 11, 12, 13, 14];

    for (const color of colors) {
        for (const number of numbers) {
            cards.push(createCard(number, color));
        }
    }
    return cards;
}

export const pullCard = (cards: Card[]): Card | undefined => {
    if (cards.length === 0) return undefined;
    const idx = Math.floor(Math.random() * cards.length);
    return cards.splice(idx, 1)[0];
};
export const firstCardOnTable = (cards: Card[]) => {
    return cards.length > 0 ? cards[0] : undefined;
};