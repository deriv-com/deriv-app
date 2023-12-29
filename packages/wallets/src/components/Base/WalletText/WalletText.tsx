import React, { CSSProperties, ElementType, ReactNode } from 'react';
import classNames from 'classnames';
import { TGenericSizes } from '../../../types';
import './WalletText.scss';

export interface WalletTextProps {
    align?: CSSProperties['textAlign'];
    as?: ElementType;
    children: ReactNode;
    color?: CSSProperties['color'] | 'error' | 'general' | 'less-prominent' | 'primary' | 'success' | 'warning';
    fontStyle?: CSSProperties['fontStyle'];
    lineHeight?: TGenericSizes;
    size?: Exclude<TGenericSizes, '3xs' | '6xl' | '7xl'>;
    weight?: CSSProperties['fontWeight'];
}

const WalletText: React.FC<WalletTextProps> = ({
    align = 'left',
    as = 'span',
    children,
    color = 'general',
    fontStyle = 'normal',
    lineHeight,
    size = 'md',
    weight = 'normal',
}) => {
    const textClassNames = classNames(
        'wallet-text',
        `wallets-text__size--${size}`,
        `wallets-text__weight--${weight}`,
        `wallets-text__align--${align}`,
        `wallets-text__color--${color}`,
        `wallets-text__line-height--${lineHeight}`,
        `wallets-text__font-style--${fontStyle}`
    );

    const Tag = as;

    return <Tag className={textClassNames}>{children}</Tag>;
};

export default WalletText;
