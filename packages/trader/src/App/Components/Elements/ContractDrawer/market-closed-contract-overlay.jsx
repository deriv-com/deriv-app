import React from 'react';
import { Localize } from '@deriv/translations';
// eslint-disable-next-line import/no-useless-path-segments
import MarketCountdownTimer from '../market-countdown-timer.jsx';

const MarketClosedContractOverlay = () => (
    <React.Fragment>
        <div className='contract-card--market-closed'>
            <p className='contract-card--market-closed--heading'>
                <Localize i18n_default_text='Market is closed' />
            </p>
            <MarketCountdownTimer />
        </div>
    </React.Fragment>
);

export default MarketClosedContractOverlay;
