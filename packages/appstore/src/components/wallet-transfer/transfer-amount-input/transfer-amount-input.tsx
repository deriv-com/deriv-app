import React from 'react';
import { useCurrencyConfig } from '@deriv/api';
import { useFormikContext } from 'formik';
import type { TInitialValues } from '../wallet-transfer';
import { AmountInput } from '@deriv/components';

const TransferAmountInput = () => {
    const { values: {from_account}, setValues } = useFormikContext<TInitialValues>();

    return (
                <AmountInput
                    currency={from_account?.currency || ''}
                    decimal_places={getConfig(from_account?.currency || '')?.fractional_digits || 0}
                    disabled={false}
                    has_error={message_list.some(el => el.type === 'error')}
                    initial_value={field.value}
                    label={label}
                    onChange={(value: number) => {
                        if (from_account?.currency === to_account?.currency) {
                            setValues({
                                from_amount: value,
                                to_amount: is_amount_to_input_disabled ? 0 : value,
                            });
                        } else {
                            debounceFromConversion(value, setValues);
                        }
                    }}
                />
            )}
        </Field>
    );
};

export default TransferAmountInput;
