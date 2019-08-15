import React from 'react';

const Modal = props => {
    const { id, title, isOpen, onClose } = props;

    return (
        <div id={id} style={{ display: isOpen ? 'block' : 'none' }} className='modal'>
            <div className='modal__header'>
                <span className='modal__title'>{title}</span>
                <button className='modal__close' onClick={onClose}>☓</button>
            </div>
            <div className='modal__content'>
                {props.children}
            </div>
        </div>
    );
};

export default Modal;
