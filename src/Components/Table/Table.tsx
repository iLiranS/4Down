import React, { useEffect, useMemo, useState } from 'react'
import { playerTableInfo, PlayerType } from '../../types/GameTypes'
import { card } from '../../utils/cards';
import OtherPlayer from './OtherPlayer';
import Card from '../UI/Card';

// main table - will include the deck card, players, last 5 cards list.
const Table: React.FC<{ players: PlayerType[], cardHistory: card[], playerId: string | undefined, turn: string }> = ({ players, cardHistory, playerId, turn }) => {
    const [playersTableInfo, setPlayersTableInfo] = useState<playerTableInfo[]>([]);
    const [playerIndex, setPlayerIndex] = useState(playerId ? players.map(player => player.id).indexOf(playerId) : -1)

    // initialization of players information - runs once on setup 
    useEffect(() => {
        const playersInfo: playerTableInfo[] = players.map((player) => {
            const playerInfo = Rune.getPlayerInfo(player.id);
            return ({
                name: playerInfo.displayName,
                image: playerInfo.avatarUrl,
                cardCount: player.cards.length,
                isAlive: player.isAlive,
                isEmpty: false,
                isTurn: turn === player.id,
                down_count: player.down_count
            });
        });

        // Pad to always have 4 players - might change this later , but for cosmetic reasons I need 3 players around the circle
        while (playersInfo.length < 4) {
            playersInfo.push({
                name: 'Empty',
                image: '',
                cardCount: 0,
                isAlive: false,
                isEmpty: true,
                isTurn: false,
                down_count: 0
            });
        }

        setPlayersTableInfo(playersInfo);
    }, [players]);

    const playersMapped = useMemo(() => {
        // Don't render anything if we don't have valid player info
        if (playerIndex === -1 || !playersTableInfo.length) return <></>;

        const gridPositions = ['left', 'top', 'right'];

        const otherPlayers = [1, 2, 3].map(offset => {
            const index = (playerIndex + offset) % playersTableInfo.length;
            return playersTableInfo[index] || {
                name: 'Empty',
                image: '',
                cardCount: 0,
                isAlive: false,
                isEmpty: true
            };
        });

        return otherPlayers.map((player, idx) => (
            <li key={idx}
                style={{ gridArea: gridPositions[idx] }}
            >
                <OtherPlayer orderIndex={idx} playerTableInfo={player} />
            </li>
        ));
    }, [playersTableInfo, playerIndex]);

    return (
        <ol className='tableGrid h-full w-full gap-2'>
            {playersMapped}
            <li style={{ gridArea: 't' }} className='grid place-items-center relative'>
                <Card key={cardHistory[0].toString() + '-' + cardHistory.length} className='z-10 animate-[scaleIn_0.3s_ease-in-out]' card={cardHistory[0]} />
                {cardHistory.length > 1 && <Card className='absolute z-[1] left-4 -translate-y-4 opacity-30 scale-90' card={cardHistory[1]} />}

            </li>
        </ol>
    )
}

export default Table