import React from 'react';
import clsx from 'clsx';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { formatDuration, getDateFromNow, getDiffDuration } from '@deriv/shared';

const MultipliersExpirationInfo = observer(() => {
    const { expiration, is_market_closed } = useTraderStore();
    const { common } = useStore();
    const { server_time: start_time } = common;
    const { days, timestamp } = formatDuration(
        getDiffDuration(Number(start_time?.unix()), Number(expiration)),
        'HH:mm'
    );
    const date = getDateFromNow(days, 'day', 'DD MMM YYYY');

    return (
        <div className='multipliers-expiration-info__container'>
            <Text size='sm' className={clsx(is_market_closed && 'trade-params__text--disabled')}>
                <Localize i18n_default_text='Expires on' />
            </Text>
            <Text size='sm' bold className={clsx(is_market_closed && 'trade-params__text--disabled')}>
                <Localize i18n_default_text='{{date}} at {{timestamp}}' values={{ date, timestamp }} />
            </Text>
        </div>
    );
});

export default MultipliersExpirationInfo;
