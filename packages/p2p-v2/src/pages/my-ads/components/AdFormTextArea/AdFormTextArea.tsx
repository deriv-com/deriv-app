import React from 'react';
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { VALID_SYMBOLS_PATTERN } from '@/constants';
import { getTextFieldError } from '@/utils';
import { TextArea } from '@deriv-com/ui';

type TAdFormTextAreaProps = {
    field: string;
    hint?: string;
    label: string;
    name: string;
    required?: boolean;
};
const AdFormTextArea = ({ field, hint = '', label, name, required = false }: TAdFormTextAreaProps) => {
    const { control } = useFormContext();
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                <div className='px-[2.4rem] mb-[3.5rem] pt-[1.8rem]'>
                    <TextArea
                        hint={error ? error.message : hint}
                        isInvalid={!!error}
                        label={label}
                        maxLength={300}
                        onBlur={onBlur}
                        onChange={onChange}
                        shouldShowCounter
                        textSize='sm'
                        value={value}
                    />
                </div>
            )}
            rules={{
                pattern: {
                    message: getTextFieldError(field),
                    value: VALID_SYMBOLS_PATTERN,
                },
                required: required ? `${field} is required` : undefined,
            }}
        />
    );
};

export default AdFormTextArea;
