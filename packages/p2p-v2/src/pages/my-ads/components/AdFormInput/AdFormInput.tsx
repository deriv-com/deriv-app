import React, { ComponentProps, ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { getValidationRules } from '@/utils';
import { Input } from '@deriv-com/ui';

type TAdFormInputProps = ComponentProps<typeof Input> & {
    currency?: string;
    label: string;
    name: string;
    rightPlaceholder: ReactNode;
    triggerValidationFunction?: () => void;
};

const AdFormInput = ({ label, name, rightPlaceholder, triggerValidationFunction, ...props }: TAdFormInputProps) => {
    const { control, getValues } = useFormContext();
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                <div className='px-[1.6rem] mb-[3.5rem] w-full lg:px-[2.4rem]'>
                    <Input
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
