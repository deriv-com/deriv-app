import React from 'react';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';

const PayoutPerPointInfo = observer(() => {
    const { contract_type, currency, proposal_info } = useTraderStore();
    const contract_key = contract_type.toUpperCase();
    const { value: payout_per_point } = proposal_info[contract_key]?.obj_contract_basis || {};

    return (
        <div className='payout-per-point-info__container'>
            <Text size='sm'>
                <Localize i18n_default_text='Payout per point' />
            </Text>
            <Text size='sm' bold>
                {payout_per_point} {currency}
            </Text>
        </div>
    );
});

export default PayoutPerPointInfo;
