import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TextArea } from '../../../../../components';
import { TextField } from '../../../../../components/TextField';
import { VALID_SYMBOLS_PATTERN } from '../../../../../constants';

type TPaymentMethodField = {
    control: ReturnType<typeof useForm>['control'];
    defaultValue: string;
    displayName: string;
    field: string;
    required?: boolean;
};

const PaymentMethodField = ({ control, defaultValue, displayName, field, required }: TPaymentMethodField) => {
    return (
        <div className='p2p-v2-payment-method-form__field-wrapper'>
            {field === 'instructions' ? (
                <Controller
                    control={control}
                    defaultValue={defaultValue}
                    name={field}
                    render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => {
                        return (
                            <TextArea
                                hint={error?.message}
                                isInvalid={!!error?.message}
                                label={displayName}
                                onBlur={onBlur}
                                onChange={onChange}
                                value={value}
                            />
                        );
                    }}
                    rules={{
                        pattern: {
                            message: `${displayName} can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;`, // TODO: Remember to translate this
                            value: VALID_SYMBOLS_PATTERN,
                        },
                        required: required ? 'This field is required.' : false,
                    }}
                />
            ) : (
                <Controller
                    control={control}
                    defaultValue={defaultValue}
                    name={field}
                    render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => {
                        return (
                            <TextField
                                errorMessage={error?.message}
                                isInvalid={!!error?.message}
                                label={displayName}
                                onBlur={onBlur}
                                onChange={onChange}
                                value={value}
                            />
                        );
                    }}
                    rules={{
                        pattern: {
                            message: `${displayName} can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;`, // TODO: Remember to translate this
                            value: VALID_SYMBOLS_PATTERN,
                        },
                        required: required ? 'This field is required.' : false,
                    }}
                />
            )}
        </div>
    );
};

export default PaymentMethodField;
