import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { Localize } from '@deriv/translations';
import { Money } from '@deriv/components';
import { Text } from '@deriv-com/quill-ui';
import { useTraderStore } from 'Stores/useTraderStores';

type TMultipliersDealCancellationInfoProps = {
    classname?: string;
};

const MultipliersDealCancellationInfo = observer(({ classname }: TMultipliersDealCancellationInfoProps) => {
    const { currency, has_cancellation, proposal_info } = useTraderStore();
    const deal_cancellation_fee_value = proposal_info?.MULTUP?.cancellation?.ask_price;

    if (!has_cancellation || !deal_cancellation_fee_value) return null;

    return (
        <div className={clsx('multipliers-info__row', classname)}>
            <Text size='sm'>
                <Localize i18n_default_text='Deal cancellation fee' />
            </Text>
            <Text size='sm' bold>
                <Money amount={deal_cancellation_fee_value} show_currency currency={currency} />
            </Text>
        </div>
    );
});

export default MultipliersDealCancellationInfo;
