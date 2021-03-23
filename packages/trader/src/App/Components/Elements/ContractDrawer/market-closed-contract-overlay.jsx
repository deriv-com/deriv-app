import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
// eslint-disable-next-line import/no-useless-path-segments
import MarketCountdownTimer from '../market-countdown-timer.jsx';

const MarketClosedContractOverlay = ({ symbol }) => {
    const [is_timer_loading, setIsTimerLoading] = React.useState(true);

    return (
        <div
            className={classNames('contract-card__market-closed', {
                'contract-card__market-closed--loading': is_timer_loading,
            })}
        >
            <Text
                align='center'
                as='p'
                className='contract-card__market-closed__title'
                styles={{ color: 'var(--brand-orange)' }}
                weight='bold'
            >
                <Localize i18n_default_text='Market is closed' />
            </Text>
            <MarketCountdownTimer setIsTimerLoading={setIsTimerLoading} symbol={symbol} />
        </div>
    );
};

MarketClosedContractOverlay.propTypes = {
    symbol: PropTypes.string,
};

export default MarketClosedContractOverlay;
