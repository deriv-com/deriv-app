import React, { ComponentProps, forwardRef } from 'react';
import { Button } from '@deriv-com/ui';
import { FormInputField } from '../FormFields';

type InputWithButtonProps = ComponentProps<typeof FormInputField> & {
    buttonText: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    onClick?: () => void;
};

export const InputWithButton = forwardRef<HTMLInputElement, InputWithButtonProps>(
    ({ buttonText, isDisabled, isLoading, label, name, onClick, validationSchema, ...rest }: InputWithButtonProps) => {
        return (
            <div className='flex w-[400px] sm:max-w-[400px] sm:w-full mt-[27px] mx-auto mb-0'>
                <FormInputField
                    {...rest}
                    className='rounded-ee-none rounded-se-none border-r-0 h-40'
                    label={label}
                    name={name}
                    validationSchema={validationSchema}
                    wrapperClassName='w-full'
                />
                <Button
                    className='rounded-es-none rounded-ss-none h-40 min-w-64'
                    disabled={isDisabled}
                    isLoading={isLoading}
                    onClick={onClick}
                >
                    {buttonText}
                </Button>
            </div>
        );
    }
);

InputWithButton.displayName = 'InputWithButton';
