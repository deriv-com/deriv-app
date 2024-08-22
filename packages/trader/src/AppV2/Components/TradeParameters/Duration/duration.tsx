import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { ActionSheet, TextField } from '@deriv-com/quill-ui';
import { getUnitMap } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import DurationActionSheetContainer from './container';

type TDurationProps = {
    is_minimized?: boolean;
};

const Duration = observer(({ is_minimized }: TDurationProps) => {
    const { duration, duration_unit } = useTraderStore();
    const { name_plural, name } = getUnitMap()[duration_unit] ?? {};
    const duration_unit_text = name_plural ?? name;
    const [selected_hour, setSelectedHour] = useState<number[]>([]);
    const [is_open, setOpen] = useState(false);

    useEffect(() => {
        if (duration_unit === 'm' && duration > 59) {
            const hour = Math.floor(duration / 60);
            const minutes = duration % 60;
            setSelectedHour([hour, minutes]);
        }
    }, [duration, duration_unit]);

    const onClose = () => {
        setOpen(false);
    };
    return (
        <>
            <TextField
                variant='fill'
                readOnly
                label={<Localize i18n_default_text='Duration' key={`duration${is_minimized ? '-minimized' : ''}`} />}
                value={`${
                    selected_hour.length > 0
                        ? `${selected_hour[0]} ${localize('hours')} ${selected_hour[1]} ${localize('minutes')} `
                        : `${duration} ${duration_unit_text}`
                }`}
                className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                onClick={() => setOpen(true)}
            />
            <ActionSheet.Root isOpen={is_open} onClose={onClose} position='left' expandable={false}>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <DurationActionSheetContainer selected_hour={selected_hour} setSelectedHour={setSelectedHour} />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </>
    );
});

export default Duration;
