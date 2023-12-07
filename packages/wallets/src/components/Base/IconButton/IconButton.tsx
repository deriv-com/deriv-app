import React, { ComponentProps, forwardRef, Ref } from 'react';
import { qtMerge } from '@deriv/quill-design';
import { TGenericSizes } from '../../../types';
import './IconButton.scss';

interface IconButtonProps extends ComponentProps<'button'> {
    color?: 'black' | 'primary' | 'transparent' | 'white';
    icon: React.ReactNode;
    isRound?: boolean;
    onClick?: ComponentProps<'button'>['onClick'];
    size?: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    (
        { className, color = 'primary', disabled, icon, isRound, onClick, size = 'sm', ...rest },
        ref: Ref<HTMLButtonElement>
    ) => {
        const sizes = {
            lg: 'p-600 h-2000',
            md: 'p-400 h-1600',
            sm: 'p-200 h-1200',
        };

        const buttonSize = sizes[size];
        const buttonColor = `wallets-icon-button__color--${color}`; // TODO: install cva to control button colors and variations

        return (
            <button
                className={qtMerge(
                    `inline-flex align-middle justify-center hover:cursor-pointer ${
                        isRound ? 'rounded-pill' : 'rounded-md'
                    }`,
                    buttonSize,
                    buttonColor,
                    className
                )}
                disabled={disabled}
                onClick={onClick}
                ref={ref}
                {...rest}
            >
                <div className='inline-flex align-middle justify-center w-800 h-800'>{icon}</div>
            </button>
        );
    }
);

IconButton.displayName = 'IconButton';
export default IconButton;
