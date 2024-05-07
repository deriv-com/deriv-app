import React from 'react';
import { Button, ExpansionPanel, Icon } from '@deriv/components';

export const getIcon = (type: string) => {
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

type TMessageWithButton = {
    unique_id: string;
    type: string;
    message: string;
    btn_text: string;
    onClick: () => void;
};

export const messageWithButton = ({ unique_id, type, message, btn_text, onClick }: TMessageWithButton) => (
    <>
        <div key={`${unique_id}_message`} className='notify__item-container'>
            <Icon key={`${unique_id}_icon`} icon={getIcon(type)} size='22' />
            <div key={`${unique_id}_text`} className='notify__item-message'>
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

export const messageWithImage = (message: string, image: string) => (
    <>
        <div className='notify__item-message'>{message}</div>
        <img src={image} style={{ width: '100%' }} />
    </>
);

// eslint-disable-next-line react/display-name
export const arrayAsMessage = parsedArray => measure => <ExpansionPanel message={parsedArray} onResize={measure} />;
