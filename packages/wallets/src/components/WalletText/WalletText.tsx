import React from 'react';
import classNames from 'classnames';
import styles from './WalletText.module.css';

interface WalletTextProps {
    align?: 'center' | 'left' | 'right';
    children: React.ReactNode;
    color?: 'black' | 'error' | 'general' | 'primary' | 'success' | 'warning' | 'white';
    size?: 'l' | 'm' | 's' | 'sm' | 'xs' | 'xxs' | 'xxxs' | 'xxxxs';
    weight?: 'bold' | 'bolder' | 'normal';
}

const WalletText: React.FC<WalletTextProps> = ({
    align = 'left',
    children,
    color = 'general',
    size = 's',
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
