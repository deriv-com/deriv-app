import React from 'react';
import './SecondaryActionButton.scss';

const SecondaryActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, ...rest }) => (
    <button className='wallets-secondary-action-button' {...rest}>
        {children}
    </button>
);

export default SecondaryActionButton;
