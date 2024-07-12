import React from 'react';
import { TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import clsx from 'clsx';
import { useTraderStore } from 'Stores/useTraderStores';

type TMultiplierProps = {
    is_minimized?: boolean;
} & Pick<ReturnType<typeof useTraderStore>, 'multiplier'>;

const Multiplier = ({ is_minimized, multiplier }: TMultiplierProps) => {
    return (
        <TextField
            variant='fill'
            readOnly
            label={<Localize i18n_default_text='Multiplier' />}
            value={`x${multiplier}`}
            className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
        />
    );
};

export default Multiplier;
