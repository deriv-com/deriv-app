import React, { ComponentProps, CSSProperties, ReactElement } from 'react';
import classNames from 'classnames';
import { Loader } from '../../Loader';
import { TGenericSizes } from '../types';
import { WalletText } from '../WalletText';
import './WalletButton.scss';

type TVariant = 'contained' | 'ghost' | 'outlined';
type TColor = 'black' | 'primary-light' | 'primary' | 'white';

interface WalletButtonProps {
    color?: TColor;
    disabled?: ComponentProps<'button'>['disabled'];
    icon?: ReactElement;
    isFullWidth?: boolean;
    isLoading?: boolean;
    onClick?: ComponentProps<'button'>['onClick'];
    rounded?: Extract<TGenericSizes, 'md' | 'sm'>;
    size?: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
    text?: React.ReactNode;
    type?: ComponentProps<'button'>['type'];
    variant?: TVariant;
}

const WalletButton: React.FC<WalletButtonProps> = ({
    color = 'primary',
    disabled = false,
    icon,
    isFullWidth = false,
    isLoading = false,
    onClick,
    rounded = 'sm',
    size = 'md',
    text,
    type,
    variant = 'contained',
}) => {
    const isContained = variant === 'contained';

    const buttonClassNames = classNames(
        'wallets-button',
        `wallets-button__size--${size}`,
        `wallets-button__variant--${variant}`,
        `wallets-button__rounded--${rounded}`,
        isContained && `wallets-button__color--${color}`,
        isFullWidth && 'wallets-button__full-width'
    );

    type TButtonFontColor = {
        [key in TVariant]: {
            [key in TColor]: string;
        };
    };

    const fontColorMapper: TButtonFontColor = {
        contained: {
            black: 'white',
            primary: 'white',
            'primary-light': 'error',
            white: 'general',
        },
        ghost: {
            black: 'error',
            primary: 'error',
            'primary-light': 'error',
            white: 'error',
        },
        outlined: {
            black: 'general',
            primary: 'general',
            'primary-light': 'general',
            white: 'general',
        },
    };

    const loaderColorMapper: Record<TColor, CSSProperties['color']> = {
        black: '#333333',
        primary: '#FFFFFF',
        'primary-light': '#EC3F3F',
        white: '#85ACB0',
    };

    const buttonFontSizeMapper = {
        lg: 'md',
        md: 'sm',
        sm: 'xs',
    } as const;

    return (
        <button className={buttonClassNames} disabled={disabled} onClick={onClick} type={type}>
            {isLoading && (
                <div className='wallets-button__loader'>
                    <Loader color={isContained ? loaderColorMapper[color] : '#85ACB0'} isFullScreen={false} />
                </div>
            )}
            {icon && !isLoading && icon}
            {text && !isLoading && (
                <WalletText
                    align='center'
                    color={fontColorMapper[variant][color]}
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
