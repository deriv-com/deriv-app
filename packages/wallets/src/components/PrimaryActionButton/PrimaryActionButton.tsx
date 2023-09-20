import React from 'react';
import './PrimaryActionButton.scss';

const PrimaryActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, ...rest }) => (
    <button className='wallets-primary-action-button' {...rest}>
        {children}
    </button>
);

export default PrimaryActionButton;
