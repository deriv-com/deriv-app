import React, { ButtonHTMLAttributes, ComponentProps, forwardRef, Ref } from 'react';
import { twMerge } from 'tailwind-merge';
import { TGenericSizes } from '../types';
import { iconButtonVariants } from './IconButtonClassnames';

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
                className={twMerge(iconButtonVariants({ color, isRound, size }), className)}
                disabled={disabled}
                onClick={onClick}
                ref={ref}
                {...rest}
            >
                <div className='grid w-16 h-16 place-content-center'>{icon}</div>
            </button>
        );
    }
);

IconButton.displayName = 'IconButton';
