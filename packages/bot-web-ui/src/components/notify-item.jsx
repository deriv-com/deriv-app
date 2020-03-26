import React from 'react';
import { Button, Icon } from '@deriv/components';
import '../assets/sass/notify-item.scss';

const getIcon = type => {
    switch (type) {
        case 'error':
            return 'IcAlertDanger';
        case 'warn':
            return 'IcAlertWarning';
        case 'info':
            return 'IcAlertInfo';
        default:
            return 'IcAlertWarning';
    }
};

export const messageWithButton = ({ unique_id, type, message, btn_text, onClick }) => (
    <>
        <div className='notify__item-container'>
            <Icon icon={getIcon(type)} size='22' />
            <div key={`${unique_id}_message`} className='notify__item-message'>
                {message}
            </div>
        </div>
        <Button
            key={`${unique_id}_btn`}
            className='notify__item-button'
            text={btn_text}
            onClick={onClick}
            has_effect
            secondary
        />
    </>
);

export const messageWithImage = (message, image) => (
    <>
        <div className='notify__item-message'>{message}</div>
        <img src={image} style={{ width: '100%' }} />
    </>
);
