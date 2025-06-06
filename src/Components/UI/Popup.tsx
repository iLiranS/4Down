import React from 'react'
import { createPortal } from 'react-dom';
import { FaRegCircleXmark } from "react-icons/fa6";
interface PopupProps {
    children: React.ReactNode;
    onClose?: () => void;
    closable?: boolean;
    title: string
}

const Popup: React.FC<PopupProps> = ({ children, onClose, closable = true, title }) => {

    const onCloseHandler = () => {
        if (!closable) return
        if (onClose) onClose();
    }



    const el = createPortal(
        <div className={`absolute top-0 left-0 h-screen w-screen grid place-items-center`}>
            <div onClick={onCloseHandler} className='bg-black/40 z-40 w-full h-full absolute top-0 left-0'>

            </div>
            <div className="bg-gray-400/30 backdrop-blur-md shadow-md w-10/12 h-10/12 p-3 rounded-lg z-50 flex flex-col gap-2 relative overflow-y-auto">
                <section className='flex items-center justify-between'>
                    <p></p>
                    <p>{title}</p>
                    <div onClick={onCloseHandler} className='cursor-pointer text-xl'>{closable && <FaRegCircleXmark />}</div>

                </section>
                {children}
            </div>
        </div>,
        document.body,

    );
    return el;
}

export default Popup