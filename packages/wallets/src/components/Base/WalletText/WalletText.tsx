import React from 'react';
import classNames from 'classnames';
import styles from './WalletText.module.css';

interface WalletTextProps {
    align?: 'center' | 'left' | 'right';
    children: React.ReactNode;
    color?: 'black' | 'error' | 'general' | 'primary' | 'success' | 'warning' | 'white';
    size?: '2xl' | '2xs' | '3xl' | '3xs' | '4xl' | '4xs' | 'lg' | 'md' | 'sm' | 'xl' | 'xs';
    weight?: 'bold' | 'normal';
}

const WalletText: React.FC<WalletTextProps> = ({
    align = 'left',
    children,
    color = 'general',
    size = 'md',
    weight = 'normal',
}) => {
    const textClassNames = classNames(
        styles.wallets,
        styles[`wallets-text-size-${size}`],
        styles[`wallets-text-weight-${weight}`],
        styles[`wallets-text-align-${align}`],
        styles[`wallets-text-color-${color}`]
    );

    return <span className={textClassNames}>{children}</span>;
};

export default WalletText;
