import React, { useCallback, useMemo } from 'react';
import { useFormikContext } from 'formik';
import { Text } from '@deriv/components';
import { useCountdown, useExchangeRate } from '@deriv/hooks';
import { Localize } from '@deriv/translations';
import type { TInitialValues } from '../../types';

const TransferAmountTimer = () => {
    const { errors, setValues, values } = useFormikContext<TInitialValues>();
    const { count, reset, start } = useCountdown({ from: 60 });
    const { getRate } = useExchangeRate();

    const { from_account, to_account, from_amount, to_amount } = values;
    const is_error = Array.isArray(errors.from_amount) && errors.from_amount?.length > 0;
    const is_timer_visible = useMemo(() => {
        const is_same_currency = from_account?.currency === to_account?.currency;
        const is_zero_amount = to_amount === 0 || from_amount === 0;

        return !is_same_currency && !is_zero_amount && !is_error;
    }, [from_account?.currency, to_account?.currency, to_amount, from_amount, is_error]);

    React.useEffect(() => {
        if (is_timer_visible) start();
    }, [is_timer_visible, start]);

    const onCompleteTimer = useCallback(() => {
        const from_rate = getRate(from_account?.currency || '');
        const to_rate = getRate(to_account?.currency || '');
        const converted_amount = (from_amount * to_rate) / from_rate;
        setValues({
            ...values,
            from_amount,
            to_amount: converted_amount,
        });
    }, [from_account?.currency, from_amount, getRate, setValues, to_account?.currency, values]);

    React.useEffect(() => {
        if (count === 0) {
            onCompleteTimer();
            reset();
        }
    }, [count, onCompleteTimer, reset]);

    if (is_timer_visible)
        return (
            <Text
                as='p'
                size='xs'
                color='less-prominent'
                className='wallet-transfer__transfer-amount-timer'
                data-testid='dt_timer'
            >
                <Localize i18n_default_text='{{remaining_time}}s' values={{ remaining_time: count }} />
            </Text>
        );

    return null;
};

export default TransferAmountTimer;
