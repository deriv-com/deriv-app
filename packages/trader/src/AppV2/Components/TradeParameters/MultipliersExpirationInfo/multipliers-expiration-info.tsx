import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { formatDuration, getDateFromNow, getDiffDuration } from '@deriv/shared';
import clsx from 'clsx';

const MultipliersExpirationInfo = observer(({ is_minimized }: { is_minimized?: boolean }) => {
    const { expiration } = useTraderStore();
    const { common } = useStore();
    const { server_time: start_time } = common;
    const { days, timestamp } = formatDuration(
        getDiffDuration(Number(start_time?.unix()), Number(expiration)),
        'HH:mm'
    );
    const date = getDateFromNow(days, 'day', 'DD MMM YYYY');

    return (
        <div
            className={clsx('multipliers-expiration-info__container', {
                'multipliers-expiration-info__container--isHidden': is_minimized,
            })}
        >
            <Text size='sm'>
                <Localize i18n_default_text='Expires on' />
            </Text>
            <Text size='sm' bold>
                <Localize i18n_default_text='{{date}} at {{timestamp}}' values={{ date, timestamp }} />
            </Text>
        </div>
    );
});

export default MultipliersExpirationInfo;
