import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import MarketCountdownTimer from './market-countdown-timer.jsx';

const MarketIsClosedOverlay = ({ is_eu, is_market_available, onClick }) => {
    let message = '';
    let btn_text = '';
    if (is_eu) {
        btn_text = localize('View open markets');
        message = is_market_available
            ? 'Market is closed. Explore other available trading options.'
            : 'Market is closed.';
    } else {
        btn_text = localize('Try Synthetic Indices');
        message =
            'Market is closed. Try Synthetic Indices which simulate real-world market volatility and are open 24/7.';
    }

    return (
        <div className='market-is-closed-overlay'>
            <MarketCountdownTimer is_main_page />
            <p>
                <Localize i18n_default_text={message} />
            </p>
            {(!is_eu || (is_eu && is_market_available)) && (
                <Button className='market-is-closed-overlay__button' onClick={onClick} text={btn_text} primary />
            )}
        </div>
    );
};

MarketIsClosedOverlay.propTypes = {
    is_eu: PropTypes.bool,
    onClick: PropTypes.func,
};

export default MarketIsClosedOverlay;
