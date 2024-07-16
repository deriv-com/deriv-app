import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { TextField } from '@deriv-com/quill-ui';
import { localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';

type TMultiplierProps = {
    is_minimized?: boolean;
};

const Multiplier = observer(({ is_minimized }: TMultiplierProps) => {
    const { multiplier } = useTraderStore();
    return (
        <TextField
            variant='fill'
            readOnly
            label={localize('Multiplier')}
            value={`x${multiplier}`}
            className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
        />
    );
});

export default Multiplier;
