import React from 'react';
import './PrimaryActionButton.scss';

type TProps = React.ComponentProps<'button'> & {
    disabled?: boolean;
};

const PrimaryActionButton: React.FC<TProps> = ({ children, disabled, ...rest }) => {
    return (
        <button className={`wallets-primary-action-button${disabled ? '-disabled' : ''}`} {...rest}>
            {children}
        </button>
    );
};

export default PrimaryActionButton;
