import React, { ChangeEvent, FocusEvent, useEffect } from 'react';
import clsx from 'clsx';
import {
    formatMoney,
    mobileOSDetect,
    percentOf,
    removeTrailingZeros,
    roundOffDecimal,
    setDecimalPlaces,
} from '@/utils';
import { p2p, useExchangeRateSubscription } from '@deriv/api-v2';
import { Text, useDevice } from '@deriv-com/ui';
import InputField from '../InputField';
import './FloatingRate.scss';

type TFloatingRate = {
    changeHandler?: (event: ChangeEvent<HTMLInputElement>) => void;
    errorMessages: string;
    fiatCurrency: string;
    localCurrency: string;
    name?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    value?: string;
};

const FloatingRate = ({
    changeHandler,
    errorMessages,
    fiatCurrency,
    localCurrency,
    name,
    onChange,
    value,
}: TFloatingRate) => {
    const { data: exchangeRateValue, subscribe } = useExchangeRateSubscription();
    const { isMobile } = useDevice();

    const { data: p2pSettings } = p2p.settings.useGetSettings();
    const overrideExchangeRate = p2pSettings?.override_exchange_rate;
    const marketRate = overrideExchangeRate
        ? Number(overrideExchangeRate)
        : exchangeRateValue?.rates?.[localCurrency] ?? 1;
    const os = mobileOSDetect();
    const marketFeed = value ? percentOf(marketRate, Number(value)) : marketRate;
    const decimalPlace = setDecimalPlaces(marketFeed, 6);

    useEffect(() => {
        if (localCurrency) {
            subscribe({
                base_currency: 'USD',
                target_currency: localCurrency,
            });
        }
    }, [localCurrency, subscribe]);

    // // Input mask for formatting value on blur of floating rate field
    const onBlurHandler = (event: FocusEvent<HTMLInputElement>) => {
        let floatRate = event.target.value;
        if (!isNaN(parseFloat(floatRate)) && floatRate.trim().length) {
            floatRate = parseFloat(floatRate).toFixed(2);
            if (/^\d+/.test(floatRate) && parseFloat(floatRate) > 0) {
                // Assign + symbol for positive rate
                event.target.value = `+${floatRate}`;
            } else {
                event.target.value = floatRate;
            }
        }
        onChange(event);
    };

    return (
        <div className={clsx('p2p-v2-floating-rate')}>
            <div className={clsx('p2p-v2-floating-rate__field')}>
                <Text as='div' className='p2p-v2-floating-rate__field--prefix' size={isMobile ? 'lg' : 'md'}>
                    at
                </Text>
                <InputField
                    decimalPointChange={2}
                    isError={!!errorMessages}
                    name={name}
                    onBlur={onBlurHandler}
                    onChange={changeHandler}
                    type={isMobile && os !== 'iOS' ? 'tel' : 'number'}
                    value={value ?? ''}
                />
                <div className='p2p-v2-floating-rate__mkt-rate'>
                    <Text className='p2p-v2-floating-rate__mkt-rate--label' size={isMobile ? 'sm' : 'xs'}>
                        of the market rate
                    </Text>
                    <Text
                        className='p2p-v2-floating-rate__mkt-rate--msg'
                        color='prominent'
                        size={isMobile ? 'sm' : 'xs'}
                    >
                        1 {fiatCurrency} = {removeTrailingZeros(formatMoney(localCurrency, marketRate, true, 6))}
                    </Text>
                </div>
            </div>
            {errorMessages ? (
                <Text
                    as='div'
                    className='p2p-v2-floating-rate__error-message'
                    color='red'
                    size={isMobile ? 'sm' : 'xs'}
                >
                    {errorMessages}
                </Text>
            ) : (
                <Text
                    as='div'
                    className='p2p-v2-floating-rate__hint'
                    color='blue'
                    line_height='xs'
                    size={isMobile ? 'sm' : 'xs'}
                >
                    Your rate is ={' '}
                    {removeTrailingZeros(
                        formatMoney(localCurrency, roundOffDecimal(marketFeed, decimalPlace), true, decimalPlace)
                    )}{' '}
                    {localCurrency}
                </Text>
            )}
        </div>
    );
};

export default FloatingRate;
