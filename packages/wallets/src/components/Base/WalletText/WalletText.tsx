import React, { ComponentProps, CSSProperties, ReactNode } from 'react';
import classNames from 'classnames';
import { TGenericSizes } from '../types';
import './WalletText.scss';

interface WalletTextProps extends ComponentProps<'span'> {
    align?: CSSProperties['textAlign'];
    children: ReactNode;
    color?: CSSProperties['color'] | 'error' | 'general' | 'primary' | 'success' | 'warning';
    lineHeight?: TGenericSizes;
    size?: Exclude<TGenericSizes, '5xl' | '6xl'>;
    weight?: CSSProperties['fontWeight'];
}

const WalletText: React.FC<WalletTextProps> = ({
    align = 'left',
    children,
    color = 'general',
    lineHeight,
    size = 'md',
    weight = 'normal',
    ...rest
}) => {
    const textClassNames = classNames(
        'wallet-text',
        `wallets-text-size-${size}`,
        `wallets-text-weight-${weight}`,
        `wallets-text-align-${align}`,
        `wallets-text-color-${color}`,
        `wallets-text-line-height-${lineHeight}`
    );

    return (
        <span className={textClassNames} {...rest}>
            {children}
        </span>
    );
};

export default WalletText;
