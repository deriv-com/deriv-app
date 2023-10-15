import React, { ComponentProps, CSSProperties } from 'react';
import classNames from 'classnames';
import styles from './WalletButton.module.css';

interface WalletButtonProps extends ComponentProps<'button'> {
    children: React.ReactNode;
    color?: CSSProperties['color'] | 'primary-light' | 'primary';
    isRounded?: boolean;
    size?: 'lg' | 'md' | 'sm';
    variant?: 'contained' | 'outlined' | 'text';
}

const WalletButton: React.FC<WalletButtonProps> = ({
    children,
    color = 'primary',
    isRounded = false,
    size = 'md',
    variant = 'contained',
    ...rest
}) => {
    const isContained = variant === 'contained';
    const buttonClassNames = classNames(
        styles[`wallets-button`],
        (isContained && styles[`wallets-button-color-${color}`]) || '',
        styles[`wallets-button-size-${size}`],
        styles[`wallets-button-variant-${variant}`],
        isRounded ? styles[`wallets-button-rounded-full`] : styles[`wallets-button-rounded-default`]
    );

    return (
        <button className={buttonClassNames} {...rest}>
            {children}
        </button>
    );
};

export default WalletButton;
