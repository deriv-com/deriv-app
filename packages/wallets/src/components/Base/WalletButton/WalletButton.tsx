import React, { ComponentProps, CSSProperties, ReactElement } from 'react';
import classNames from 'classnames';
import { TGenericSizes } from '../types';
import { WalletText } from '../WalletText';
import './WalletButton.scss';

type TVariant = 'ghost' | 'outlined' | ('contained' & { color: WalletButtonProps['color'] });

interface WalletButtonProps {
    color?: CSSProperties['color'] | 'primary-light' | 'primary';
    disabled?: ComponentProps<'button'>['disabled'];
    icon?: ReactElement;
    isFullWidth?: boolean;
    isRounded?: boolean;
    onClick?: ComponentProps<'button'>['onClick'];
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
        `wallets-button__size--${size}`,
        `wallets-button__variant--${variant}`,
        isRounded ? 'wallets-button__rounded--full' : 'wallets-button__rounded--default',
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
