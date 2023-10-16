import React, { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import { TGenericSizes } from '../types';
import { WalletText } from '../WalletText';
import styles from './WalletButton.module.css';

interface WalletButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    color?: 'black' | 'primary-light' | 'primary' | 'white';
    icon?: React.ReactNode;
    isRounded?: boolean;
    size?: Omit<TGenericSizes, 'lg' | 'md' | 'sm'>;
    text?: React.ReactNode;
    variant?: 'contained' | 'ghost' | 'outlined';
}

const WalletButton: React.FC<WalletButtonProps> = ({
    color = 'primary',
    icon,
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
        isRounded ? styles['wallets-button-rounded-full'] : styles['wallets-button-rounded-default']
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

    const buttonFontSize = {
        lg: 'sm',
        md: 'sm',
        sm: 'xs',
    };

    return (
        <button className={buttonClassNames} {...rest}>
            {hasIcon && icon}
            {hasText && (
                <WalletText align='center' color={buttonFontColor()} size={buttonFontSize[size] || 'sm'} weight='bold'>
                    {text}
                </WalletText>
            )}
        </button>
    );
};

export default WalletButton;
