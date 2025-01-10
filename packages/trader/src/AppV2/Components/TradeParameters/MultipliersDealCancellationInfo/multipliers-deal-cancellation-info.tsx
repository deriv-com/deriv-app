import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { Localize } from '@deriv/translations';
import { Money, Skeleton } from '@deriv/components';
import { Text } from '@deriv-com/quill-ui';
import { useTraderStore } from 'Stores/useTraderStores';
import { CONTRACT_TYPES } from '@deriv/shared';

const MultipliersDealCancellationInfo = observer(() => {
    const { currency, is_market_closed, proposal_info } = useTraderStore();
    const deal_cancellation_fee_value = proposal_info?.[CONTRACT_TYPES.MULTIPLIER.UP]?.cancellation?.ask_price;
    const has_error =
        proposal_info?.[CONTRACT_TYPES.MULTIPLIER.UP]?.has_error ||
        proposal_info?.[CONTRACT_TYPES.MULTIPLIER.DOWN]?.has_error;

    if (has_error) return null;

    return (
        <div className='multipliers-info__row'>
            <Text size='sm' className={clsx(is_market_closed && 'trade-params__text--disabled')}>
                <Localize i18n_default_text='Deal cancellation fee' />
            </Text>
            <Text size='sm' bold as='div' className={clsx(is_market_closed && 'trade-params__text--disabled')}>
                {deal_cancellation_fee_value ? (
                    <Money amount={deal_cancellation_fee_value} show_currency currency={currency} />
                ) : (
                    <Skeleton width={65} height={18} />
                )}
            </Text>
        </div>
    );
});

export default MultipliersDealCancellationInfo;
