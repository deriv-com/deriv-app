import React from 'react';
import { observer } from 'mobx-react';
import { Localize } from '@deriv/translations';
import { Money, Skeleton } from '@deriv/components';
import { Text } from '@deriv-com/quill-ui';
import { useTraderStore } from 'Stores/useTraderStores';
import { CONTRACT_TYPES } from '@deriv/shared';

const AccumulatorsInformation = observer(({ is_disabled }: { is_disabled?: boolean }) => {
    const { currency, maximum_payout, proposal_info } = useTraderStore();
    const has_error = proposal_info[CONTRACT_TYPES.ACCUMULATOR]?.has_error;

    if (has_error) return null;

    return (
        <div className='accumulators-info__wrapper'>
            <Text size='sm' color={is_disabled ? 'quill-typography__color--disabled' : ''}>
                <Localize i18n_default_text='Max. payout' />
            </Text>
            {maximum_payout ? (
                <Text size='sm' bold color={is_disabled ? 'quill-typography__color--disabled' : ''}>
                    <Money amount={maximum_payout} show_currency currency={currency} />
                </Text>
            ) : (
                <Skeleton width={100} height={14} />
            )}
        </div>
    );
});

export default AccumulatorsInformation;
