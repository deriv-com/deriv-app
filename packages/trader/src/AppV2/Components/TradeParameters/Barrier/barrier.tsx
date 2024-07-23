import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';

type TDurationProps = {
    is_minimized?: boolean;
};

const Barrier = observer(({ is_minimized }: TDurationProps) => {
    const { barrier_1 } = useTraderStore();
    return (
        <TextField
            variant='fill'
            readOnly
            label={<Localize i18n_default_text='Barrier' />}
            value={barrier_1}
            className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
            id={`barrier${is_minimized ? '--minimized' : ''}`}
        />
    );
});

export default Barrier;
