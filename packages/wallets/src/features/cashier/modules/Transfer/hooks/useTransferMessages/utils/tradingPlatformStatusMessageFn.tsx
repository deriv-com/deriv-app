import React from 'react';
import { Localize } from '@deriv-com/translations';
import { TRADING_PLATFORM_STATUS } from '../../../../../../cfd/constants';
import { TMessageFnProps } from '../../../types';

const tradingPlatformStatusMessageFn = ({ platformStatus }: TMessageFnProps) => {
    const isMaintenance = platformStatus === TRADING_PLATFORM_STATUS.MAINTENANCE;

    const message = isMaintenance ? (
        <Localize i18n_default_text='We’re currently performing server maintenance. Service may be affected.' />
    ) : (
        <Localize i18n_default_text='The server is temporarily unavailable for this account. We’re working to resolve this.' />
    );

    return {
        message,
        type: 'error' as const,
    };
};

export default tradingPlatformStatusMessageFn;
