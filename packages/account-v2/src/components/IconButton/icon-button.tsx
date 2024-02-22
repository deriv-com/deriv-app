import React, { ButtonHTMLAttributes, ComponentProps, forwardRef, Ref } from 'react';
import clsx from 'clsx';
import { TGenericSizes } from '../types';
import { iconButtonVariants } from './icon-button.classnames';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    color?: 'black' | 'primary' | 'transparent' | 'white';
    icon: React.ReactNode;
    isRound?: boolean;
    onClick?: ComponentProps<'button'>['onClick'];
    size?: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    (
        { className, color = 'primary', disabled, icon, isRound, onClick, size = 'sm', ...rest },
        ref: Ref<HTMLButtonElement>
    ) => {
        return (
            <button
                className={clsx(iconButtonVariants({ color, isRound, size }), className)}
                disabled={disabled}
                onClick={onClick}
                ref={ref}
                {...rest}
            >
                <div className='grid w-800 h-800 place-content-center'>{icon}</div>
            </button>
        );
    }
);

IconButton.displayName = 'IconButton';
