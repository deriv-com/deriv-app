import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { Skeleton } from '@deriv/components';

type TPayoutPerPointProps = {
    is_minimized?: boolean;
};

const PayoutPerPoint = observer(({ is_minimized }: TPayoutPerPointProps) => {
    const { contract_type, currency, proposal_info } = useTraderStore();
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
            label={
                <Localize
                    i18n_default_text='Payout per point'
                    key={`payout-per-point${is_minimized ? '-minimized' : ''}`}
                />
            }
            value={`${payout_per_point} ${getCurrencyDisplayCode(currency)}`}
            className={classname}
        />
    );
});

export default PayoutPerPoint;
