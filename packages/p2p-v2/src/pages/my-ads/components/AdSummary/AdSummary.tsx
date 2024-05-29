import React, { useEffect } from 'react';
import { AD_ACTION, RATE_TYPE } from '@/constants';
import { useQueryString } from '@/hooks';
import { percentOf, roundOffDecimal, setDecimalPlaces } from '@/utils';
import { p2p, useExchangeRateSubscription } from '@deriv/api-v2';
import { Text, useDevice } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';

type TAdSummaryProps = {
    adRateType?: string; // ratetype for the ad when action is edit
    currency: string;
    localCurrency?: string;
    offerAmount: string;
    priceRate: number;
    rateType: string;
    type: string;
};

const AdSummary = ({
    adRateType = '',
    currency,
    localCurrency = '',
    offerAmount,
    priceRate,
    rateType,
    type,
}: TAdSummaryProps) => {
    const { isMobile } = useDevice();
    const { queryString } = useQueryString();
    const adOption = queryString.formAction;
    const { data: p2pSettings } = p2p.settings.useGetSettings();
    const { data: exchangeRateValue, subscribe } = useExchangeRateSubscription();
    const overrideExchangeRate = p2pSettings?.override_exchange_rate;

    const marketRateType = adOption === AD_ACTION.CREATE ? rateType : adRateType;
    const displayOfferAmount = offerAmount ? FormatUtils.formatMoney(Number(offerAmount), { currency }) : '';
    const adText = adOption === AD_ACTION.CREATE ? 'creating' : 'editing';
    const adTypeText = type;

    let displayPriceRate: number | string = '';
    let displayTotal = '';

    useEffect(() => {
        subscribe({
            base_currency: 'USD',
            target_currency: localCurrency,
        });
    }, [localCurrency, subscribe]);

    const exchangeRate = exchangeRateValue?.rates?.[localCurrency];
    const marketRate = overrideExchangeRate ? Number(overrideExchangeRate) : exchangeRate;
    const marketFeed = marketRateType === RATE_TYPE.FLOAT ? marketRate : null;
    const summaryTextSize = isMobile ? 'md' : 'sm';

    if (priceRate) {
        displayPriceRate = marketFeed ? roundOffDecimal(percentOf(marketFeed, priceRate), 6) : priceRate;
    }

    if (offerAmount) {
        if (priceRate) {
            displayTotal = FormatUtils.formatMoney(
                Number(offerAmount) * Number(marketFeed ? displayPriceRate : priceRate),
                { currency: localCurrency }
            );
            const formattedPriceRate = FormatUtils.formatMoney(Number(displayPriceRate), {
                currency: localCurrency,
                decimalPlaces: setDecimalPlaces(Number(displayPriceRate), 6),
            });
            return (
                <Text color='less-prominent' size={summaryTextSize}>
                    {`You’re ${adText} an ad to ${adTypeText}`}
                    <Text color='blue' size={summaryTextSize} weight='bold'>
                        {` ${displayOfferAmount} ${currency} `}
                    </Text>
                    for
                    <Text color='blue' size={summaryTextSize} weight='bold'>
                        {` ${displayTotal} ${localCurrency}`}
                    </Text>
                    <Text color='blue' size={summaryTextSize}>
                        {` (${formattedPriceRate} ${localCurrency}/${currency})`}
                    </Text>
                </Text>
            );
        }

        return (
            <Text color='less-prominent' size={summaryTextSize}>
                {`You’re ${adText} an ad to ${adTypeText}`}
                <Text color='blue' size={summaryTextSize} weight='bold'>
                    {` ${displayOfferAmount} ${currency}`}
                </Text>
                ...
            </Text>
        );
    }

    return (
        <Text color='less-prominent' size={summaryTextSize}>
            {`You’re ${adText} an ad to ${adTypeText}...`}
        </Text>
    );
};

export default AdSummary;
