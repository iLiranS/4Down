import React from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ className = '', children, ...props }) => {

    return (
        <button
            className={twMerge('p-2 hover:scale-105 disabled:hover:scale-100 transition-transform rounded-md bg-white/10 hover:cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed ', className)}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;