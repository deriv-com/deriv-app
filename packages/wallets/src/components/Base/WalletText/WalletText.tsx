import React, { ComponentProps, CSSProperties, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './WalletText.module.css';

interface WalletTextProps extends ComponentProps<'span'> {
    align?: 'center' | 'left' | 'right';
    children: ReactNode;
    color?: CSSProperties['color'] | 'error' | 'general' | 'primary' | 'success' | 'warning';
    lineHeight?: '2xl' | '2xs' | '3xl' | '3xs' | '4xl' | '4xs' | '5xl' | '6xl' | 'lg' | 'md' | 'sm' | 'xl' | 'xs';
    size?: '2xl' | '2xs' | '3xl' | '3xs' | '4xl' | '4xs' | 'lg' | 'md' | 'sm' | 'xl' | 'xs';
    weight?: 'bold' | 'normal';
}

const WalletText: React.FC<WalletTextProps> = ({
    align = 'left',
    children,
    color = 'general',
    lineHeight = 'md',
    size = 'md',
    weight = 'normal',
    ...rest
}) => {
    const textClassNames = classNames(
        styles.wallets,
        styles[`wallets-text-size-${size}`],
        styles[`wallets-text-weight-${weight}`],
        styles[`wallets-text-align-${align}`],
        styles[`wallets-text-color-${color}`],
        styles[`wallets-text-line-height-${lineHeight}`]
    );

    return (
        <span className={textClassNames} {...rest}>
            {children}
        </span>
    );
};

export default WalletText;
