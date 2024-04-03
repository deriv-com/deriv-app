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
            <div className='flex w-[40rem] sm:w-full sm:max-w-[40rem] mt-[2.7rem] mx-auto mb-0'>
                <FormInputField
                    {...rest}
                    className='rounded-ee-none rounded-se-none border-r-0 h-[4rem]'
                    label={label}
                    name={name}
                    validationSchema={validationSchema}
                />
                <Button
                    className='rounded-es-none rounded-ss-none h-[4rem] m-w-[6.4rem]'
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
