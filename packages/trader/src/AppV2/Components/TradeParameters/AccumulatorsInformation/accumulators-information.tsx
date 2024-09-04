import React from 'react';
import { observer } from 'mobx-react';
import { Localize } from '@deriv/translations';
import { Money, Skeleton } from '@deriv/components';
import { Text } from '@deriv-com/quill-ui';
import { useTraderStore } from 'Stores/useTraderStores';
import { CONTRACT_TYPES } from '@deriv/shared';

type TAccumulatorsInformationProps = {
    is_minimized?: boolean;
};

const AccumulatorsInformation = observer(({ is_minimized }: TAccumulatorsInformationProps) => {
    const { currency, maximum_payout, proposal_info } = useTraderStore();
    const has_error = proposal_info[CONTRACT_TYPES.ACCUMULATOR]?.has_error;

    if (is_minimized || has_error) return null;

    return (
        <div className='accumulators-info__wrapper'>
            <Text size='sm' className='accumulators-info__title'>
                <Localize i18n_default_text='Max. payout' />
            </Text>
            {maximum_payout ? (
                <Text size='sm' bold>
                    <Money amount={maximum_payout} show_currency currency={currency} />
                </Text>
            ) : (
                <Skeleton width={100} height={14} />
            )}
        </div>
    );
});

export default AccumulatorsInformation;
