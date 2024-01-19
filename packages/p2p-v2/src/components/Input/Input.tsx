import React from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { useDevice } from '../../hooks';
import './Input.scss';

type TInputProps = {
    errorMessage?: string;
    hasError?: boolean;
    onBlur?: () => void;
    onChange?: () => void;
    placeholder?: string;
    ref?: React.Ref<HTMLInputElement> | React.RefCallback<HTMLInputElement>;
    value?: string;
};

const Input = ({ errorMessage, hasError, onBlur, onChange, placeholder, ref, value }: TInputProps) => {
    const { isMobile } = useDevice();

    return (
        <div className='p2p-v2-input'>
            <input
                className={clsx('p2p-v2-input__field', {
                    'p2p-v2-input__field--error': hasError,
                })}
                onBlur={onBlur}
                onChange={onChange}
                placeholder={placeholder}
                ref={ref}
                value={value}
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
