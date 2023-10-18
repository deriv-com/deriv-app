import React, { ComponentProps, CSSProperties, ReactNode } from 'react';
import classNames from 'classnames';
import { TGenericSizes } from '../types';
import styles from './WalletText.module.css';

interface WalletTextProps extends ComponentProps<'span'> {
    align?: CSSProperties['textAlign'];
    children: ReactNode;
    color?: CSSProperties['color'] | 'error' | 'general' | 'primary' | 'success' | 'warning';
    lineHeight?: TGenericSizes;
    size?: TGenericSizes;
    weight?: CSSProperties['fontWeight'];
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
