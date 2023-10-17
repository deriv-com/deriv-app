import React, { ButtonHTMLAttributes, ReactElement } from 'react';
import classNames from 'classnames';
import { TGenericSizes } from '../types';
import { WalletText } from '../WalletText';
import styles from './WalletButton.module.css';

interface WalletButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    color?: 'black' | 'primary-light' | 'primary' | 'white';
    icon?: ReactElement;
    isFullWidth?: boolean;
    isRounded?: boolean;
    size?: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
    text?: React.ReactNode;
    variant?: 'contained' | 'ghost' | 'outlined';
}

const WalletButton: React.FC<WalletButtonProps> = ({
    color = 'primary',
    icon,
    isFullWidth = false,
    isRounded = false,
    size = 'md',
    text,
    variant = 'contained',
    ...rest
}) => {
    const isContained = variant === 'contained';
    const isOutlined = variant === 'outlined';
    const isGhost = variant === 'ghost';
    const hasIcon = !!icon;
    const hasText = !!text;

    const buttonClassNames = classNames(
        styles['wallets-button'],
        isContained && styles[`wallets-button-color-${color}`],
        styles[`wallets-button-size-${size}`],
        styles[`wallets-button-variant-${variant}`],
        isRounded ? styles['wallets-button-rounded-full'] : styles['wallets-button-rounded-default'],
        isFullWidth && styles['wallets-button-full-width']
    );

    const buttonFontColor = () => {
        if (isContained) {
            switch (color) {
                case 'black':
                    return 'white';
                case 'primary-light':
                    return 'error';
                case 'primary':
                    return 'white';
                case 'white':
                    return 'general';
                default:
                    return 'white';
            }
        } else if (isOutlined) {
            return 'general';
        } else if (isGhost) {
            return 'error';
        }
    };

    const buttonFontSizeMapper: Record<Extract<TGenericSizes, 'lg' | 'md' | 'sm'>, TGenericSizes> = {
        lg: 'sm',
        md: 'sm',
        sm: 'xs' as const,
    };

    return (
        <button className={buttonClassNames} {...rest}>
            {hasIcon && icon}
            {hasText && (
                <WalletText
                    align='center'
                    color={buttonFontColor()}
                    size={buttonFontSizeMapper[size] || 'sm'}
                    weight='bold'
                >
                    {text}
                </WalletText>
            )}
        </button>
    );
};

export default WalletButton;
