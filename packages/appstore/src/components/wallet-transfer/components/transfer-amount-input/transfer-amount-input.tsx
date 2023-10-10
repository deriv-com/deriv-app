import React, { useMemo } from 'react';
import debounce from 'lodash.debounce';
import { useFormikContext, Field, FieldProps } from 'formik';
import { useCurrencyConfig } from '@deriv/api';
import { AmountInput } from '@deriv/components';
import { useExchangeRate } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useWalletTransferValidation } from '../../hooks';
import type { TInitialValues } from '../../types';

type TTransferAmountInput = {
    field_name: 'from_amount' | 'to_amount';
    setTimerKey: React.Dispatch<React.SetStateAction<number>>;
};

type TGetDecimalPlaces = {
    getConfig: ReturnType<typeof useCurrencyConfig>['getConfig'];
    currency?: string;
};

const getDecimalPlaces = ({ getConfig, currency }: TGetDecimalPlaces) => {
    return getConfig(currency || '')?.fractional_digits || 0;
};

const TransferAmountInput = observer(({ field_name, setTimerKey }: TTransferAmountInput) => {
    const { errors, values, setFieldValue } = useFormikContext<TInitialValues>();
    const { from_account, to_account } = values;
    const { getConfig } = useCurrencyConfig();
    const { getRate } = useExchangeRate();
    const { validator } = useWalletTransferValidation({ from_account, to_account });

    const is_amount_to_input_disabled = !to_account;
    const is_from_amount_input_field = field_name === 'from_amount';
    const is_same_currency = from_account?.currency === to_account?.currency;

    const debounceFromConversion = useMemo(
        () =>
            debounce(value => {
                const from_rate = getRate(from_account?.currency || '');
                const to_rate = getRate(to_account?.currency || '');
                const converted_amount = (value * to_rate) / from_rate;
                const to_amount_value = is_amount_to_input_disabled
                    ? 0
                    : Number(converted_amount.toFixed(getConfig(to_account?.currency || '')?.fractional_digits || 0));
                setFieldValue('from_amount', value);
                setFieldValue('to_amount', to_amount_value);
                //reset timer
                setTimerKey(prev => prev + 1);
            }, 1000),
        [
            getConfig,
            getRate,
            is_amount_to_input_disabled,
            setFieldValue,
            setTimerKey,
            from_account?.currency,
            to_account?.currency,
        ]
    );

    const debounceToConversion = useMemo(
        () =>
            debounce(value => {
                const from_rate = getRate(from_account?.currency || '');
                const to_rate = getRate(to_account?.currency || '');
                const converted_amount = (value * from_rate) / to_rate;
                const from_amount_value = Number(
                    converted_amount.toFixed(getConfig(from_account?.currency || '')?.fractional_digits || 0)
                );
                setFieldValue('from_amount', from_amount_value);
                setFieldValue('to_amount', value);
                //reset timer
                setTimerKey(prev => prev + 1);
            }, 1000),
        [getConfig, getRate, setFieldValue, setTimerKey, from_account?.currency, to_account?.currency]
    );

    const amount_input_props = useMemo(() => {
        const to_amount_input_label =
            to_account?.currency && !is_same_currency ? (
                <Localize i18n_default_text='Estimated amount' />
            ) : (
                <Localize i18n_default_text='Amount you receive' />
            );

        return {
            currency: is_from_amount_input_field ? from_account?.currency || '' : to_account?.currency || '',
            decimal_places: is_from_amount_input_field
                ? getDecimalPlaces({ getConfig, currency: from_account?.currency })
                : getDecimalPlaces({ getConfig, currency: to_account?.currency }),
            disabled: !is_from_amount_input_field && is_amount_to_input_disabled,
            label: is_from_amount_input_field ? (
                <Localize i18n_default_text='Amount you send' />
            ) : (
                to_amount_input_label
            ),
        };
    }, [
        getConfig,
        is_amount_to_input_disabled,
        is_from_amount_input_field,
        is_same_currency,
        from_account?.currency,
        to_account?.currency,
    ]);

    const onChangeAmountInput = (value: number) => {
        if (is_same_currency) {
            // eslint-disable-next-line no-nested-ternary
            const to_amount_value = !is_from_amount_input_field ? value : is_amount_to_input_disabled ? 0 : value;
            setFieldValue('from_amount', value);
            setFieldValue('to_amount', to_amount_value);
        } else {
            is_from_amount_input_field ? debounceFromConversion(value) : debounceToConversion(value);
        }
    };

    return (
        <Field name={field_name} validate={field_name === 'from_amount' ? validator : undefined}>
            {({ field }: FieldProps<number>) => (
                <AmountInput
                    {...field}
                    {...amount_input_props}
                    initial_value={field.value}
                    onChange={onChangeAmountInput}
                    has_error={Array.isArray(errors.from_amount) && errors.from_amount?.length > 0}
                />
            )}
        </Field>
    );
});

export default TransferAmountInput;
