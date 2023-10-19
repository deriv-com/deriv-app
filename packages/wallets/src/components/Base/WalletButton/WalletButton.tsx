import React, { ButtonHTMLAttributes, CSSProperties, ReactElement } from 'react';
import classNames from 'classnames';
import { TGenericSizes } from '../types';
import { WalletText } from '../WalletText';
import './WalletButton.scss';

type TVariant = 'ghost' | 'outlined' | ('contained' & { color: WalletButtonProps['color'] });

interface WalletButtonProps {
    color?: CSSProperties['color'] | 'primary-light' | 'primary';
    disabled?: ButtonHTMLAttributes<HTMLButtonElement>['disabled'];
    icon?: ReactElement;
    isFullWidth?: boolean;
    isRounded?: boolean;
    onClick: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
    size?: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
    text?: React.ReactNode;
    variant?: TVariant;
}

const WalletButton: React.FC<WalletButtonProps> = ({
    color = 'primary',
    disabled = false,
    icon,
    isFullWidth = false,
    isRounded = false,
    onClick,
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
        isContained && `wallets-button-color-${color}`,
        `wallets-button-size-${size}`,
        `wallets-button-variant-${variant}`,
        isRounded ? 'wallets-button-rounded-full' : 'wallets-button-rounded-default',
        isFullWidth && 'wallets-button-full-width'
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

    const buttonFontSizeMapper: Record<
        Extract<TGenericSizes, 'lg' | 'md' | 'sm'>,
        Extract<TGenericSizes, 'sm' | 'xs'>
    > = {
        lg: 'sm',
        md: 'sm',
        sm: 'xs' as const,
    };

    return (
        <button className={buttonClassNames} disabled={disabled} onClick={onClick}>
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
