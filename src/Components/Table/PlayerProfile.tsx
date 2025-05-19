import React from 'react'
import { downCount } from '../../types/GameTypes'

const PlayerProfile: React.FC<{ img_src: string, down_count: downCount, isAlive: boolean }> = ({ img_src, down_count, isAlive }) => {
    return (
        <div>
            PlayerProfile
            {/* later implement profile picture circualr and below the down_count , also if not alive make it all greysacled */}
        </div>
    )
}

export default PlayerProfile