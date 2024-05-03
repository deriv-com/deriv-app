import React, { ChangeEvent, FocusEvent, useEffect } from 'react';
import { mobileOSDetect, percentOf, removeTrailingZeros, roundOffDecimal, setDecimalPlaces } from '@/utils';
import { p2p, useExchangeRateSubscription } from '@deriv/api-v2';
import { Text, useDevice } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';
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
    const textSize = isMobile ? 'sm' : 'xs';

    useEffect(() => {
        if (localCurrency) {
            subscribe({
                base_currency: 'USD',
                target_currency: localCurrency,
            });
        }
    }, [localCurrency, subscribe]);

    // Input mask for formatting value on blur of floating rate field
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
        <div className='p2p-v2-floating-rate'>
            <div className='p2p-v2-floating-rate__field'>
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
                    <Text className='p2p-v2-floating-rate__mkt-rate--label' size={textSize}>
                        of the market rate
                    </Text>
                    <Text className='p2p-v2-floating-rate__mkt-rate--msg' color='prominent' size={textSize}>
                        1 {fiatCurrency} ={' '}
                        {removeTrailingZeros(
                            FormatUtils.formatMoney(marketRate, {
                                currency: localCurrency,
                                decimalPlaces: decimalPlace,
                            })
                        )}
                    </Text>
                </div>
            </div>
            {errorMessages ? (
                <Text as='div' className='p2p-v2-floating-rate__error-message' color='red' size={textSize}>
                    {errorMessages}
                </Text>
            ) : (
                <Text as='div' className='p2p-v2-floating-rate__hint' color='blue' size={textSize}>
                    Your rate is ={' '}
                    {removeTrailingZeros(
                        FormatUtils.formatMoney(Number(roundOffDecimal(marketFeed, decimalPlace)), {
                            currency: localCurrency,
                            decimalPlaces: decimalPlace,
                        })
                    )}{' '}
                    {localCurrency}
                </Text>
            )}
        </div>
    );
};

export default FloatingRate;
