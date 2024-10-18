import React from 'react';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { Skeleton } from '@deriv/components';

const PayoutPerPointInfo = observer(({ is_disabled }: { is_disabled?: boolean }) => {
    const { contract_type, currency, proposal_info } = useTraderStore();
    const contract_key = contract_type.toUpperCase();
    const { value: payout_per_point } = proposal_info[contract_key]?.obj_contract_basis || {};
    const has_error = proposal_info[contract_key]?.has_error;

    if (has_error) return null;

    return (
        <div className='payout-per-point-info__container'>
            <Text size='sm' color={is_disabled ? 'quill-typography__color--disabled' : ''}>
                <Localize i18n_default_text='Payout per point' />
            </Text>
            {payout_per_point ? (
                <Text size='sm' bold color={is_disabled ? 'quill-typography__color--disabled' : ''}>
                    {payout_per_point} {currency}
                </Text>
            ) : (
                <Skeleton width={100} height={14} />
            )}
        </div>
    );
});

export default PayoutPerPointInfo;
