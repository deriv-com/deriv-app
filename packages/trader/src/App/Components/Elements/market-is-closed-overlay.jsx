import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import MarketCountdownTimer from './market-countdown-timer.jsx';

const MarketIsClosedOverlay = ({ is_eu, is_synthetics_trading_market_available, onClick, onMarketOpen, symbol }) => {
    const [is_timer_loading, setIsTimerLoading] = React.useState(true);

    let message = (
        <Localize i18n_default_text='In the meantime, try our synthetic indices. They simulate real-market volatility and are open 24/7.' />
    );
    let btn_lbl = localize('Try Synthetic Indices');

    if (!is_synthetics_trading_market_available) {
        message = null;
        btn_lbl = localize('See open markets');
    }

    return (
        <div
            className={classNames('market-is-closed-overlay', {
                'market-is-closed-overlay--loading': is_timer_loading,
            })}
        >
            <Text as='p' className='market-is-closed-overlay__main-heading' color='prominent' weight='bold'>
                <Localize i18n_default_text='This market is closed' />
            </Text>
            <MarketCountdownTimer
                is_main_page
                setIsTimerLoading={setIsTimerLoading}
                onMarketOpen={onMarketOpen}
                symbol={symbol}
            />
            {message && (
                <Text align='center' as='p' className='market-is-closed-overlay__main-message' size='xs'>
                    {message}
                </Text>
            )}
            {(!is_eu || (is_eu && is_synthetics_trading_market_available)) && (
                <Button className='market-is-closed-overlay__button' onClick={onClick} text={btn_lbl} primary />
            )}
        </div>
    );
};

MarketIsClosedOverlay.propTypes = {
    is_eu: PropTypes.bool,
    is_synthetics_trading_market_available: PropTypes.bool,
    onClick: PropTypes.func,
    onMarketOpen: PropTypes.func,
    symbol: PropTypes.string,
};

export default MarketIsClosedOverlay;
