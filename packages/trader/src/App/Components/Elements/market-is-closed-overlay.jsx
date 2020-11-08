import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import MarketCountdownTimer from './market-countdown-timer.jsx';

const MarketIsClosedOverlay = ({ is_eu, is_market_available, onClick }) => {
    let message = null;
    let button = null;
    if (is_eu) {
        button = (
            <Button
                className='market-is-closed-overlay__button'
                onClick={onClick}
                text={localize('View open markets')}
                primary
            />
        );
        message = is_market_available ? (
            <Localize i18n_default_text='Market is closed. Explore other available trading options.' />
        ) : (
            <Localize i18n_default_text='Market is closed.' />
        );
    } else {
        button = (
            <Button
                className='market-is-closed-overlay__button'
                onClick={onClick}
                text={localize('Try Synthetic Indices')}
                primary
            />
        );
        message = (
            <Localize i18n_default_text='Market is closed. Try Synthetic Indices which simulate real-world market volatility and are open 24/7.' />
        );
    }

    return (
        <div className='market-is-closed-overlay'>
            <MarketCountdownTimer is_main_page />
            <p>{message}</p>
            {(!is_eu || (is_eu && is_market_available)) && button}
        </div>
    );
};

MarketIsClosedOverlay.propTypes = {
    is_eu: PropTypes.bool,
    onClick: PropTypes.func,
};

export default MarketIsClosedOverlay;
