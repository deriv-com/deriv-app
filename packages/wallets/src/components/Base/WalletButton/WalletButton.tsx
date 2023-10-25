import React, { ComponentProps, CSSProperties, ReactElement } from 'react';
import classNames from 'classnames';
import { TGenericSizes } from '../types';
import { WalletText } from '../WalletText';
import './WalletButton.scss';

type TVariant = 'contained' | 'ghost' | 'outlined';

interface WalletButtonProps {
    color?: CSSProperties['color'] | 'primary-light' | 'primary';
    disabled?: ComponentProps<'button'>['disabled'];
    icon?: ReactElement;
    isFullWidth?: boolean;
    onClick?: ComponentProps<'button'>['onClick'];
    rounded?: Extract<TGenericSizes, 'md' | 'sm'>;
    size?: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
    text?: React.ReactNode;
    variant?: TVariant;
}

const WalletButton: React.FC<WalletButtonProps> = ({
    color = 'primary',
    disabled = false,
    icon,
    isFullWidth = false,
    onClick,
    rounded = 'sm',
    size = 'md',
    text,
    variant = 'contained',
}) => {
    const isContained = variant === 'contained';
    const isOutlined = variant === 'outlined';
    const isGhost = variant === 'ghost';
    const hasIcon = !!icon;
    const hasText = !!text;

    const buttonClassNames = classNames(
        'wallets-button',
        `wallets-button__size--${size}`,
        `wallets-button__variant--${variant}`,
        `wallets-button__rounded--${rounded}`,
        isContained && `wallets-button__color--${color}`,
        isFullWidth && 'wallets-button__full-width'
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

    const buttonFontSizeMapper = {
        lg: 'sm',
        md: 'sm',
        sm: 'xs',
    } as const;

    return (
        <button className={buttonClassNames} disabled={disabled} onClick={onClick}>
            {hasIcon && <div className='wallets-button__icon-container'>{icon}</div>}
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
