import React, { useEffect, useMemo, useState } from 'react'
import { playerTableInfo, PlayerType } from '../../types/GameTypes'
import { Card, cardToString } from '../../utils/cards';
import OtherPlayer from './OtherPlayer';
import CardComponent from '../UI/Card';
import useGameStore from '../../utils/useStore';

// main table - will include the deck card, players, last 5 cards list.
const Table: React.FC<{ players: PlayerType[], cardHistory: Card[], playerId: string | undefined, turn: string }> = ({ players, cardHistory, playerId, turn }) => {
    const [playersTableInfo, setPlayersTableInfo] = useState<playerTableInfo[]>([]);
    const [playerIndex, setPlayerIndex] = useState(playerId ? players.map(player => player.id).indexOf(playerId) : -1)
    const updateUsers = useGameStore((state) => state.initialize)


    // initialization of players information - runs once on setup 
    useEffect(() => {
        const playersInfo: playerTableInfo[] = players.filter(player => player.isAlive).map((player) => {
            const playerInfo = Rune.getPlayerInfo(player.id);
            return ({
                name: playerInfo.displayName,
                image: playerInfo.avatarUrl,
                cardCount: player.cards.length,
                isAlive: player.isAlive,
                isEmpty: false,
                isTurn: turn === player.id,
                down_count: player.down_count,
                id: player.id
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
                down_count: 0,
                id: ''
            });
        }

        setPlayersTableInfo(playersInfo);
    }, [players]);

    //  update store - I need it in other components and I fetch rune info here so...
    useEffect(() => {
        if (playersTableInfo.length < 1) return
        updateUsers(playersTableInfo)
    }, [playersTableInfo])

    const playersMapped = useMemo(() => {
        // Don't render anything if we don't have valid player info
        if (playerIndex === -1 || !playersTableInfo.length) return <></>;

        const gridPositions = ['left', 'top', 'right'];
        const isAlive = playersTableInfo.find(player => player.id === playerId)?.isAlive

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
        if (playersTableInfo.filter(player => player.isAlive).length === 2 && isAlive) {
            const otherPlayer = playersTableInfo.filter(player => player.isAlive).filter(player => player.id !== playerId)
            return <li style={{ gridArea: 'top' }}>
                <OtherPlayer orderIndex={1} playerTableInfo={otherPlayer[0]} />
            </li>
        }

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
                <CardComponent key={cardToString(cardHistory[0]) + '-' + cardHistory.length} className='z-10 animate-[scaleIn_0.3s_ease-in-out]' card={cardHistory[0]} />
                {cardHistory.length > 1 && <CardComponent className='absolute z-[1] left-4 -translate-y-4 opacity-30 scale-90' card={cardHistory[1]} />}

            </li>
        </ol>
    )
}

export default Table