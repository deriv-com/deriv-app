import React, { ReactElement } from 'react';
import clsx from 'clsx';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { useDevice } from '../../hooks';
import './Input.scss';

type TInputProps = {
    errorMessage?: string;
    hasError?: boolean;
    name: string;
    options?: Parameters<UseFormReturn['register']>[1];
    placeholder?: string;
    leadingIcon?: ReactElement
};

const Input = ({ errorMessage, hasError, name, leadingIcon, options, placeholder }: TInputProps) => {
    const { register } = useFormContext();
    const { isMobile } = useDevice();

    return (
        <div className='p2p-v2-input'>
                {leadingIcon && (
                    <div className='p2p-v2-input__leading-icon'>
                        {leadingIcon}
                        </div>
                )}
                <input
                    className={clsx('p2p-v2-input__field', {
                        'p2p-v2-input__field--error': hasError,
                    })}
                    placeholder={placeholder}
                    {...register(name, options)}
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
