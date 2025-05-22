import { cardType, gameCard } from "../types/GameTypes";

export class card {
    number: gameCard;
    color: cardType;
    fake_val?: gameCard;


    constructor(number: gameCard, color: cardType, fake_val?: gameCard) {
        this.number = number;
        this.color = color;
        if (fake_val) {
            this.fake_val = fake_val
        }
    }


    toString(): string {
        return `${this.number} of ${this.color}s`;
    }
}

export class deck {
    cards: card[];

    constructor() {
        this.cards = [];
        const colors: cardType[] = ['diamond', 'heart', 'spade', 'club'];
        const numbers: gameCard[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

        for (const color of colors) {
            for (const number of numbers) {
                this.cards.push(new card(number, color));
            }
        }
    }

    /**
     * Pulls a random card from the deck.
     * @returns {card | undefined} The pulled card, or undefined if the deck is empty.
     */
    pull(): card | undefined {
        if (this.cards.length === 0) return undefined;
        const idx = Math.floor(Math.random() * this.cards.length);
        return this.cards.splice(idx, 1)[0];
    }
    /**
     * 
     * @returns  first card on table - above J seems not fair and less fun.
     */
    firstCardOnTable(): card | undefined {
        let tmpCard = this.pull()
        while (tmpCard && tmpCard.number > 11) {
            tmpCard = this.pull()
        }

        return tmpCard
    }

    /**
     * Returns a string representation of the deck
     * @returns {string} The string representation of all cards in the deck
     */
    toString(): string {
        return this.cards.map(card => card.toString()).join(', ');
    }
}