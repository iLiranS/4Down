import React from 'react'

// pos : 1 = left , 2 = top , 3 = right
// remember it's related to current player so
// e.g player is [1] then [2] is left , [3] is top and [0] is right
const OtherPlayer: React.FC<{ pos: 1 | 2 | 3 }> = () => {
    return (
        <div>OtherPlayer</div>
    )
}

export default OtherPlayer