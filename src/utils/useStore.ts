import { create } from 'zustand'
import { playerTableInfo } from '../types/GameTypes'

type Store = {
  players: playerTableInfo[]
  initialize: (players: playerTableInfo[]) => void
}

const useGameStore = create<Store>()((set) => ({
  players: [],
  playerId: '',
  initialize: (newPlayers) => set({ players: newPlayers }),
}))
export default useGameStore