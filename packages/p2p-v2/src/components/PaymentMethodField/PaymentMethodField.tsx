import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { VALID_SYMBOLS_PATTERN } from '@/constants';
import { Input } from '@deriv-com/ui';
import { TextArea } from '..';

type TPaymentMethodField = {
    control: ReturnType<typeof useForm>['control'];
    defaultValue: string;
    displayName: string;
    field: string;
    required?: boolean;
};

/**
 * @component This component is used to display a field in the PaymentMethodForm component
 * @param {Object} props
 * @param {Object} props.control - The control object from react-hook-form
 * @param {string} props.defaultValue - The default value of the field
 * @param {string} props.displayName - The display name of the field
 * @param {string} props.field - The name of the field
 * @param {boolean} props.required - Whether the field is required or not
 * @returns {JSX.Element}
 * @example <PaymentMethodField control={control} defaultValue={defaultValue} displayName={displayName} field={field} required={required} />
 * **/
const PaymentMethodField = ({ control, defaultValue, displayName, field, required }: TPaymentMethodField) => {
    return (
        <div className='p2p-v2-payment-method-form__field-wrapper'>
            <Controller
                control={control}
                defaultValue={defaultValue}
                name={field}
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => {
                    return field === 'instructions' ? (
                        <TextArea
                            hint={error?.message}
                            isInvalid={!!error?.message}
                            label={displayName}
                            onBlur={onBlur}
                            onChange={onChange}
                            value={value}
                        />
                    ) : (
                        <Input
                            error={!!error?.message}
                            label={displayName}
                            message={error?.message}
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
        </div>
    );
};

export default PaymentMethodField;
