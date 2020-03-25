import React from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import '../assets/sass/notify-item.scss';

export const messageWithButton = (unique_id, message, onClick) => (
    <>
        <div key={`${unique_id}_message`} className='notify__item-message'>
            {message}
        </div>
        <Button
            key={`${unique_id}_btn`}
            className='notify__item-button'
            text={localize('Show me')}
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
