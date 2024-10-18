import React from 'react';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { Text } from '@deriv-com/quill-ui';
import { Money, Skeleton } from '@deriv/components';
import { Localize } from '@deriv/translations';

const PayoutInfo = observer(({ is_disabled }: { is_disabled?: boolean }) => {
    const { currency, proposal_info, trade_type_tab } = useTraderStore();
    const { value: payout } = proposal_info[trade_type_tab]?.obj_contract_basis || {};
    const has_error = proposal_info[trade_type_tab]?.has_error;

    if (has_error) return null;

    return (
        <div className='payout-info__container'>
            <Text size='sm' color={is_disabled ? 'quill-typography__color--disabled' : ''}>
                <Localize i18n_default_text='Payout' />
            </Text>
            {payout ? (
                <Text size='sm' bold color={is_disabled ? 'quill-typography__color--disabled' : ''}>
                    <Money amount={payout} show_currency currency={currency} />
                </Text>
            ) : (
                <Skeleton width={60} height={14} />
            )}
        </div>
    );
});

export default PayoutInfo;
