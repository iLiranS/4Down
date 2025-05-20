import React from 'react'

export type cardPosition = 'front' | 'left' | 'right' | 'top'

interface CardCoverProps {
    position?: cardPosition;
    className?: string;
    isFirst: boolean;
    style?: React.CSSProperties;
}

const CardCover: React.FC<CardCoverProps> = ({ position = 'front', className = '', isFirst, style }) => {
    const getTransform = () => {
        switch (position) {
            case 'left':
                return 'perspective(1000px) rotateY(60deg)';
            case 'right':
                return 'perspective(1000px) rotateY(-60deg)';
            case 'top':
                return 'perspective(1000px) rotateX(60deg)';
            default:
                return 'none';
        }
    };

    return (
        <div
            style={{ transform: getTransform(), ...style }}
            className={`
                relative  rounded-lg
                transition-all duration-300
                ${position === 'front' ? 'h-9/12 aspect-[2/3] -translate-x-3/12' : ''}
                ${(position === 'left' || position === 'right') ? 'w-9/12 -translate-y-3/12 aspect-[3/2]' : ''}
                ${className} shadow-sm shadow-black
            `}
        >

            {/* Main card background */}
            <div className="absolute inset-0 bg-blue-800 rounded-lg">
                {/* Decorative pattern */}
                <div className="absolute inset-2 border-4 border-blue-700 rounded-lg">
                    <div className="absolute inset-2 border-2 border-blue-600 rounded-sm" />
                </div>

                {/* Center pattern */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-9/12 h-9/12 border-4 border-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-1/2 h-1/2 border-4 border-blue-700 rounded-full" />
                    </div>
                </div>

                {/* Corner patterns */}
                <div className="absolute top-3 left-3 w-1/3 h-1/3 border-2 border-blue-600 rounded-full" />
                <div className="absolute top-3 right-3 w-1/3 h-1/3 border-2 border-blue-600 rounded-full" />
                <div className="absolute bottom-3 left-3 w-1/3 h-1/3 border-2 border-blue-600 rounded-full" />
                <div className="absolute bottom-3 right-3 w-1/3 h-1/3 border-2 border-blue-600 rounded-full" />
            </div>
        </div>
    )
}

export default CardCover