import classNames from 'classnames';
import React from 'react';
import { Button, Text, UILoader } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { useStore } from '@deriv/stores';
import { useTraderStore } from '../../../Stores/useTraderStores';

const MarketCountdownTimer = React.lazy(
    () => import(/* webpackChunkName: "market-countdown-timer" */ './market-countdown-timer')
);

type TMarketIsClosedOverlay = {
    is_eu: ReturnType<typeof useStore>['client']['is_eu'];
    is_synthetics_trading_market_available: ReturnType<typeof useTraderStore>['is_synthetics_trading_market_available'];
    onClick: () => void;
    onMarketOpen: React.ComponentProps<typeof MarketCountdownTimer>['onMarketOpen'];
    symbol: ReturnType<typeof useTraderStore>['symbol'];
};

const MarketIsClosedOverlay = ({
    is_eu,
    is_synthetics_trading_market_available,
    onClick,
    onMarketOpen,
    symbol,
}: TMarketIsClosedOverlay) => {
    const [is_timer_loading, setIsTimerLoading] = React.useState(true);

    let message: JSX.Element | null = (
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
            <React.Suspense fallback={<UILoader />}>
                <MarketCountdownTimer
                    is_main_page
                    setIsTimerLoading={setIsTimerLoading}
                    onMarketOpen={onMarketOpen}
                    symbol={symbol}
                />
            </React.Suspense>
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

export default MarketIsClosedOverlay;
