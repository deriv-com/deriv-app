import React from 'react';
import { observer } from 'mobx-react';
import { TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import clsx from 'clsx';
import { useTraderStore } from 'Stores/useTraderStores';

type TStrikeProps = {
    is_minimized?: boolean;
};

const Strike = observer(({ is_minimized }: TStrikeProps) => {
    const { barrier_1 } = useTraderStore();
    return (
        <TextField
            variant='fill'
            readOnly
            label={<Localize i18n_default_text='Strike price' />}
            value={barrier_1}
            className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
        />
    );
});

export default Strike;
