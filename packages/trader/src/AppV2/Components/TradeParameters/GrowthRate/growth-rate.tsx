import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import { getGrowthRatePercentage } from '@deriv/shared';

type TGrowthRateProps = {
    is_minimized?: boolean;
};

const GrowthRate = observer(({ is_minimized }: TGrowthRateProps) => {
    const { growth_rate, has_open_accu_contract } = useTraderStore();
    return (
        <TextField
            variant='fill'
            readOnly
            label={<Localize i18n_default_text='Growth rate' />}
            value={`${getGrowthRatePercentage(growth_rate)}%`}
            className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
            disabled={has_open_accu_contract}
            id={`growth-rate${is_minimized ? '--minimized' : ''}`}
        />
    );
});

export default GrowthRate;
