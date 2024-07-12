import React from 'react';
import { TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import clsx from 'clsx';
import { useTraderStore } from 'Stores/useTraderStores';
import { getGrowthRatePercentage } from '@deriv/shared';

type TGrowthRateProps = {
    is_minimized?: boolean;
} & Pick<ReturnType<typeof useTraderStore>, 'growth_rate' | 'has_open_accu_contract'>;

const GrowthRate = ({ growth_rate, has_open_accu_contract, is_minimized }: TGrowthRateProps) => {
    return (
        <TextField
            variant='fill'
            readOnly
            label={<Localize i18n_default_text='Growth rate' />}
            value={`${getGrowthRatePercentage(growth_rate)}%`}
            className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
            disabled={has_open_accu_contract}
        />
    );
};

export default GrowthRate;
