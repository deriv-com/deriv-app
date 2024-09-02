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
    const { duration, duration_unit, expiry_time, expiry_type } = useTraderStore();
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

    const getInputValues = () => {
        if (expiry_type == 'duration') {
            if (selected_hour.length > 0) {
                return `${selected_hour[0]} ${localize('hours')} ${selected_hour[1]} ${localize('minutes')} `;
            }
            return `${duration} ${duration_unit_text}`;
        }
        return `${localize('Ends at')} ${expiry_time} GMT`;
    };

    return (
        <>
            <TextField
                variant='fill'
                readOnly
                label={<Localize i18n_default_text='Duration' key={`duration${is_minimized ? '-minimized' : ''}`} />}
                value={getInputValues()}
                className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                onClick={() => setOpen(true)}
            />
            <ActionSheet.Root
                isOpen={is_open}
                onClose={() => {
                    setOpen(false);
                }}
                position='left'
                expandable={false}
            >
                <ActionSheet.Portal shouldCloseOnDrag>
                    <DurationActionSheetContainer selected_hour={selected_hour} setSelectedHour={setSelectedHour} />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </>
    );
});

export default Duration;
