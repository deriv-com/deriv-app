import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { Localize } from '@deriv/translations';
import { Money, Skeleton } from '@deriv/components';
import { Text } from '@deriv-com/quill-ui';
import { useTraderStore } from 'Stores/useTraderStores';

type TMultipliersDealCancellationInfoProps = {
    classname?: string;
};

const MultipliersDealCancellationInfo = observer(({ classname }: TMultipliersDealCancellationInfoProps) => {
    const { currency, proposal_info } = useTraderStore();
    const deal_cancellation_fee_value = proposal_info?.MULTUP?.cancellation?.ask_price;

    return (
        <div className={clsx('multipliers-info__row', classname)}>
            <Text size='sm'>
                <Localize i18n_default_text='Deal cancellation fee' />
            </Text>
            <Text size='sm' bold>
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
