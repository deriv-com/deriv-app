import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { Localize } from '@deriv/translations';
import { Money, Skeleton } from '@deriv/components';
import { Text } from '@deriv-com/quill-ui';
import { useTraderStore } from 'Stores/useTraderStores';
import { CONTRACT_TYPES } from '@deriv/shared';

type TMultipliersDealCancellationInfoProps = {
    is_minimized?: boolean;
};

const MultipliersDealCancellationInfo = observer(({ is_minimized }: TMultipliersDealCancellationInfoProps) => {
    const { currency, is_market_closed, proposal_info } = useTraderStore();

    const up_deal_cancellation_fee = proposal_info?.[CONTRACT_TYPES.MULTIPLIER.UP]?.cancellation?.ask_price;
    const down_deal_cancellation_fee = proposal_info?.[CONTRACT_TYPES.MULTIPLIER.DOWN]?.cancellation?.ask_price;

    const has_error =
        proposal_info?.[CONTRACT_TYPES.MULTIPLIER.UP]?.has_error ||
        proposal_info?.[CONTRACT_TYPES.MULTIPLIER.DOWN]?.has_error;

    if (has_error) return null;

    const renderFeeValue = (fee_value?: number) => {
        return fee_value ? (
            <Money amount={fee_value} show_currency currency={currency} />
        ) : (
            <Skeleton width={65} height={18} />
        );
    };

    if (is_minimized) {
        return (
            <div className='multipliers-info__container multipliers-info__container--horizontal'>
                <div className='multipliers-info__fee-row'>
                    <Text size='sm' className={clsx(is_market_closed && 'trade-params__text--disabled')}>
                        <Localize i18n_default_text='DC Fee' />
                    </Text>
                    <Text size='sm' bold as='div' className={clsx(is_market_closed && 'trade-params__text--disabled')}>
                        {renderFeeValue(up_deal_cancellation_fee)}
                    </Text>
                </div>
                <div className='multipliers-info__fee-row'>
                    <Text size='sm' className={clsx(is_market_closed && 'trade-params__text--disabled')}>
                        <Localize i18n_default_text='DC Fee' />
                    </Text>
                    <Text size='sm' bold as='div' className={clsx(is_market_closed && 'trade-params__text--disabled')}>
                        {renderFeeValue(down_deal_cancellation_fee)}
                    </Text>
                </div>
            </div>
        );
    }

    return (
        <div className='multipliers-info__container multipliers-info__container--stacked'>
            <div className='multipliers-info__row'>
                <Text size='sm' className={clsx(is_market_closed && 'trade-params__text--disabled')}>
                    <Localize i18n_default_text='DC fee (Up)' />
                </Text>
                <Text size='sm' bold as='div' className={clsx(is_market_closed && 'trade-params__text--disabled')}>
                    {renderFeeValue(up_deal_cancellation_fee)}
                </Text>
            </div>
            <div className='multipliers-info__row'>
                <Text size='sm' className={clsx(is_market_closed && 'trade-params__text--disabled')}>
                    <Localize i18n_default_text='DC fee (Down)' />
                </Text>
                <Text size='sm' bold as='div' className={clsx(is_market_closed && 'trade-params__text--disabled')}>
                    {renderFeeValue(down_deal_cancellation_fee)}
                </Text>
            </div>
        </div>
    );
});

export default MultipliersDealCancellationInfo;
