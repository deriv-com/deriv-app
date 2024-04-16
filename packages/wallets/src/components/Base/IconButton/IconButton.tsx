import React, { ButtonHTMLAttributes, ComponentProps, forwardRef, Ref } from 'react';
import classNames from 'classnames';
import { TGenericSizes } from '../../../types';
import './IconButton.scss';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    color?: 'black' | 'primary' | 'transparent' | 'white';
    icon: React.ReactNode;
    iconSize?: Extract<TGenericSizes, 'lg' | 'md'>;
    isRound?: boolean;
    onClick?: ComponentProps<'button'>['onClick'];
    size?: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    (
        { className, color = 'primary', disabled, icon, iconSize = 'md', isRound, onClick, size = 'sm', ...rest },
        ref: Ref<HTMLButtonElement>
    ) => {
        const iconButtonClassNames = classNames(
            'wallets-icon-button',
            `wallets-icon-button__size--${size}`,
            `wallets-icon-button__color--${color}`,
            `wallets-icon-button__border-radius--${isRound ? 'round' : 'default'}`,
            className
        );

        return (
            <button className={iconButtonClassNames} disabled={disabled} onClick={onClick} ref={ref} {...rest}>
                <div className={`wallets-icon-button__icon--${iconSize}`}>{icon}</div>
            </button>
        );
    }
);

IconButton.displayName = 'IconButton';
export default IconButton;
