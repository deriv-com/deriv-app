import React from 'react';
import styles from './Text.module.css';

interface TextProps {
    children: React.ReactNode;
    size?: 'xxxxs' | 'xxxs' | 'xxs' | 'xs' | 's' | 'sm' | 'm' | 'l';
    weight?: 'normal' | 'bold';
    align?: 'left' | 'center' | 'right';
    color?: 'general' | 'primary' | 'success' | 'warning' | 'error' | 'white' | 'black';
}

const Text: React.FC<TextProps> = ({ children, size = 's', weight = 'normal', align = 'left', color = 'general' }) => {
    const textClassNames = `${styles.wallets} ${styles[`wallets-text-size-${size}`]} ${
        styles[`wallets-text-weight-${weight}`]
    } ${styles[`wallets-text-align-${align}`]} ${styles[`wallets-text-color-${color}`]}`;

    return <span className={textClassNames}>{children}</span>;
};

export default Text;
