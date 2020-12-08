import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
// eslint-disable-next-line import/no-useless-path-segments
import MarketCountdownTimer from '../market-countdown-timer.jsx';

const MarketClosedContractOverlay = () => (
    <div className='contract-card__market-closed'>
        <Text align='center' as='p' styles={{ color: 'var(--brand-orange)', marginBottom: '1rem' }} weight='bold'>
            <Localize i18n_default_text='Market is closed' />
        </Text>
        <MarketCountdownTimer />
    </div>
);

export default MarketClosedContractOverlay;
