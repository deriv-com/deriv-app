import React, { ReactElement } from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { useDevice } from '../../hooks';
import './Input.scss';

type TInputProps = {
    errorMessage?: string;
    hasError?: boolean;
    leadingIcon?: ReactElement;
    name: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    value?: string;
};

const Input = ({ errorMessage, hasError, leadingIcon, name, placeholder, ...props }: TInputProps) => {
    const { isMobile } = useDevice();

    return (
        <div className='p2p-v2-input'>
            {leadingIcon && <div className='p2p-v2-input__leading-icon'>{leadingIcon}</div>}
            <input
                className={clsx('p2p-v2-input__field', {
                    'p2p-v2-input__field--error': hasError,
                })}
                placeholder={placeholder}
                {...props}
            />
            {hasError && (
                <Text className='p2p-v2-input__error' color='error' size={isMobile ? 'sm' : 'xs'}>
                    {errorMessage}
                </Text>
            )}
        </div>
    );
};

export default Input;
