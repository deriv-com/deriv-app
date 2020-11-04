import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
// eslint-disable-next-line import/no-useless-path-segments
import MarketCountdownTimer from '../market-countdown-timer.jsx';

const MarketClosedContractOverlay = () => (
    <div className='contract-card--market-closed'>
        <Text as='p' className='contract-card--market-closed--heading'>
            <Localize i18n_default_text='Market is closed' />
        </Text>
        <MarketCountdownTimer />
    </div>
);

export default MarketClosedContractOverlay;
