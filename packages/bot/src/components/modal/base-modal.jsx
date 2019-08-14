import React from 'react';

const Modal = props => {
    const { id, title, isOpen } = props;

    return (
        <div id={id} style={{ display: isOpen ? 'block' : 'none' }} className='modal'>
            <h1 className='modal__header'>{title}</h1>
            <div className='modal__content'>
                {props.children}
            </div>
        </div>
    );
};

export default Modal;
