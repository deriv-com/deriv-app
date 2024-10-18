import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { formatDuration, getDateFromNow, getDiffDuration } from '@deriv/shared';

const MultipliersExpirationInfo = observer(({ is_disabled }: { is_disabled?: boolean }) => {
    const { expiration } = useTraderStore();
    const { common } = useStore();
    const { server_time: start_time } = common;
    const { days, timestamp } = formatDuration(
        getDiffDuration(Number(start_time?.unix()), Number(expiration)),
        'HH:mm'
    );
    const date = getDateFromNow(days, 'day', 'DD MMM YYYY');

    return (
        <div className='multipliers-expiration-info__container'>
            <Text size='sm' color={is_disabled ? 'quill-typography__color--disabled' : ''}>
                <Localize i18n_default_text='Expires on' />
            </Text>
            <Text size='sm' bold color={is_disabled ? 'quill-typography__color--disabled' : ''}>
                <Localize i18n_default_text='{{date}} at {{timestamp}}' values={{ date, timestamp }} />
            </Text>
        </div>
    );
});

export default MultipliersExpirationInfo;
