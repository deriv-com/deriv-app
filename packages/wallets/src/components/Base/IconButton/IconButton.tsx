import React, { ComponentProps, CSSProperties, FC } from 'react';
import classNames from 'classnames';
import { TGenericSizes } from '../types';
import './IconButton.scss';

interface IconButtonProps {
    color?: CSSProperties['color'] | 'primary' | 'transparent';
    disabled?: ComponentProps<'button'>['disabled'];
    icon?: React.ReactNode;
    isRound?: boolean;
    onClick?: ComponentProps<'button'>['onClick'];
    size?: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
}

const IconButton: FC<IconButtonProps> = ({ color = 'primary', disabled, icon, isRound, onClick, size = 'sm' }) => {
    const iconButtonClassNames = classNames(
        'wallets-icon-button',
        `wallets-icon-button__size--${size}`,
        `wallets-icon-button__color--${color}`,
        isRound ? 'wallets-icon-button__border-radius--round' : 'wallets-icon-button__border-radius--default'
    );

    return (
        <button className={iconButtonClassNames} disabled={disabled} onClick={onClick}>
            <div className='wallets-icon-button__icon'>{icon}</div>
        </button>
    );
};

export default IconButton;
