import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { TextField } from '@deriv-com/quill-ui';
import { getUnitMap } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';

type TDurationProps = {
    is_minimized?: boolean;
};

const Duration = observer(({ is_minimized }: TDurationProps) => {
    const { duration, duration_unit } = useTraderStore();
    const { name_plural, name } = getUnitMap()[duration_unit];
    const duration_unit_text = name_plural ?? name;

    return (
        <TextField
            variant='fill'
            readOnly
            label={localize('Duration')}
            value={`${duration} ${duration_unit_text}`}
            className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
        />
    );
});

export default Duration;
