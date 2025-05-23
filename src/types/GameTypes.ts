import { PlayerId } from "rune-sdk"
import { card, deck } from "../utils/cards";

export type downCount = 0 | 1 | 2 | 3

// 2,3,... , 14 = ace
type bluffCard = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14
export type gameCard = bluffCard | 14;
export type cardType = 'diamond' | 'heart' | 'spade' | 'club';

export interface PlayerType {
    id: PlayerId,
    // name: string,
    // img_src: string, // apperantally we can get those two only on client side... 
    down_count: downCount
    cards: card[], // will be reduced when taking action 
    isAlive: boolean
}
// for table
export type playerTableInfo = {
    name: string,
    cardCount: number
    image: string,
    isAlive: boolean,
    isEmpty: boolean,
    isTurn: boolean,
    down_count: downCount,
    id: string
}

export type loseAnimation = {
    active: boolean,
    rotateValue: number,
    successRate: number,
    playerId: string,
    readyCount: number
}


// the game logic
export interface GameState {
    players: PlayerType[] // up to 4
    deckCards: deck
    activePlayerId: string // used as indicator for when player took action
    lastTurnPlayerId: string | undefined
    cardsHistory: card[]
    loseAnimation?: loseAnimation
    // roundTimeLeft: number // later implement round timer
}

// game actions - functions that need to be used in server side
export type GameActions = {
    nextRound: () => void, // someone got a roulette -> called from nextPlayer()
    nextTurn: (playerId: number, action: 'regular' | 'call' | 'bluff', ogCard: gameCard, bluffCard?: bluffCard) => void, // gamecard means regular, call means he is called for bluffing, bluff means he bluffed.
    // in nextTurn we also need to update GameState.players[?] such that players[?].id == playerId
}

