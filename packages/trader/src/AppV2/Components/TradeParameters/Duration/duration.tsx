import React, { useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { ActionSheet, TextField } from '@deriv-com/quill-ui';
import { getUnitMap } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import DurationActionSheetContainer from './container';

type TDurationProps = {
    is_minimized?: boolean;
};

const Duration = observer(({ is_minimized }: TDurationProps) => {
    const { duration, duration_unit } = useTraderStore();
    const { name_plural, name } = getUnitMap()[duration_unit] ?? {};
    const duration_unit_text = name_plural ?? name;
    const [is_open, setOpen] = useState(false);

    const onClose = () => {
        setOpen(false);
    };
    return (
        <>
            <TextField
                variant='fill'
                readOnly
                label={<Localize i18n_default_text='Duration' key={`duration${is_minimized ? '-minimized' : ''}`} />}
                value={`${duration} ${duration_unit_text}`}
                className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                onClick={() => setOpen(true)}
            />
            <ActionSheet.Root isOpen={is_open} onClose={onClose} position='left' expandable={false}>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <DurationActionSheetContainer />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </>
    );
});

export default Duration;
