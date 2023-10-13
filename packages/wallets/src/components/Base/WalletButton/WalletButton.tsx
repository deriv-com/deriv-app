import React, { CSSProperties } from 'react';
import classNames from 'classnames';
import styles from './WalletButton.module.css';

interface WalletButtonProps {
    children: React.ReactNode;
    // eslint-disable-next-line @typescript-eslint/sort-type-constituents
    color?: CSSProperties['color'] | 'primary' | 'primary-light';
    disabled?: boolean;
    onClick: () => void;
    // eslint-disable-next-line @typescript-eslint/sort-type-constituents
    size?: 's' | 'm' | 'l';
    type?: 'contained' | 'outlined' | 'text';
}

const WalletButton: React.FC<WalletButtonProps> = ({
    children,
    color = 'primary',
    disabled = false,
    onClick,
    size = 'm',
    type = 'contained',
}) => {
    const isContained = type === 'contained';
    const buttonClassNames = classNames(
        styles[`wallets-button`],
        (isContained && styles[`wallets-button-color-${color}`]) || '',
        styles[`wallets-button-size-${size}`],
        styles[`wallets-button-type-${type}`]
    );

    return (
        <button className={buttonClassNames} disabled={disabled} onClick={onClick} type='button'>
            {children}
        </button>
    );
};

export default WalletButton;
