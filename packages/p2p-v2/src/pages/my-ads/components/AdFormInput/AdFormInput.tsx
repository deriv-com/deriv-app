import React, { ComponentProps, ReactNode } from 'react';
import clsx from 'clsx';
import { Controller, useFormContext } from 'react-hook-form';
import { getValidationRules } from '@/utils';
import { Input } from '@deriv-com/ui';

type TAdFormInputProps = ComponentProps<typeof Input> & {
    currency?: string;
    isDisabled?: boolean;
    label: string;
    name: string;
    rightPlaceholder: ReactNode;
    triggerValidationFunction?: () => void;
};

const AdFormInput = ({
    isDisabled = false,
    label,
    name,
    rightPlaceholder,
    triggerValidationFunction,
    ...props
}: TAdFormInputProps) => {
    const { control, getValues } = useFormContext();
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                <div className={clsx('mb-[3.5rem] w-full', { 'pointer-events-none': isDisabled })}>
                    <Input
                        className={clsx({ 'text-[#999999]': isDisabled })}
                        disabled={isDisabled}
                        error={!!error?.message}
                        label={label}
                        message={error ? error?.message : ''}
                        onBlur={onBlur}
                        onChange={event => {
                            onChange(event);
                            triggerValidationFunction?.();
                        }}
                        rightPlaceholder={rightPlaceholder}
                        value={value}
                        wrapperClassName='w-full'
                        {...props}
                    />
                </div>
            )}
            rules={{
                validate: getValidationRules(name, getValues),
            }}
        />
    );
};

export default AdFormInput;
