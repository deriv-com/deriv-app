import React from 'react';
import { TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import clsx from 'clsx';
import { useTraderStore } from 'Stores/useTraderStores';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { Skeleton } from '@deriv/components';

type TPayoutPerPointProps = {
    is_minimized?: boolean;
} & Pick<ReturnType<typeof useTraderStore>, 'contract_type' | 'currency' | 'proposal_info'>;

const PayoutPerPoint = ({ contract_type, currency, is_minimized, proposal_info }: TPayoutPerPointProps) => {
    const contract_key = contract_type.toUpperCase();
    const { value: payout_per_point } = proposal_info[contract_key]?.obj_contract_basis || {};
    const classname = clsx('trade-params__option', is_minimized && 'trade-params__option--minimized');

    if (!payout_per_point)
        return (
            <div className={classname}>
                <Skeleton />
            </div>
        );
    return (
        <TextField
            variant='fill'
            readOnly
            label={<Localize i18n_default_text='Payout per point' />}
            value={`${payout_per_point} ${getCurrencyDisplayCode(currency)}`}
            className={classname}
        />
    );
};

export default PayoutPerPoint;
