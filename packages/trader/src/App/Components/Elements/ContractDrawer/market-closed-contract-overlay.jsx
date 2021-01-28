import classNames from 'classnames';
import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
// eslint-disable-next-line import/no-useless-path-segments
import MarketCountdownTimer from '../market-countdown-timer.jsx';

const MarketClosedContractOverlay = ({ is_market_close_overlay_loading }) => (
    <div
        className={classNames('contract-card__market-closed', {
            'contract-card__market-closed--loading': is_market_close_overlay_loading,
        })}
    >
        <Text align='center' as='p' styles={{ color: 'var(--brand-orange)', marginBottom: '1rem' }} weight='bold'>
            <Localize i18n_default_text='Market is closed' />
        </Text>
        <MarketCountdownTimer />
    </div>
);

export default MarketClosedContractOverlay;
