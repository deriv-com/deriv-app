import React from 'react';
import { TextField } from '@deriv-com/quill-ui';
import { getUnitMap } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import clsx from 'clsx';
import { useTraderStore } from 'Stores/useTraderStores';

type TDurationProps = {
    is_minimized?: boolean;
} & Pick<ReturnType<typeof useTraderStore>, 'duration' | 'duration_unit'>;

const Duration = ({ duration, duration_unit, is_minimized }: TDurationProps) => {
    const { name_plural, name } = getUnitMap()[duration_unit];
    const duration_unit_text = name_plural ?? name;

    return (
        <TextField
            variant='fill'
            readOnly
            label={<Localize i18n_default_text='Duration' />}
            value={`${duration} ${duration_unit_text}`}
            className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
        />
    );
};

export default Duration;
