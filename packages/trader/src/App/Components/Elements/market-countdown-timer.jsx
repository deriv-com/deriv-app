import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Text } from '@deriv/components';
import { useIsMounted, WS, convertTimeFormat, isMarketClosed } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

// check market in coming 7 days
const days_to_check_before_exit = 7;

const getTradingTimes = async target_time => {
    const data = await WS.tradingTimes(target_time);
    if (data.error) {
        return { api_initial_load_error: data.error.message };
    }
    return data;
};
// eslint-disable-next-line consistent-return
const getSymbol = (target_symbol, trading_times) => {
    let symbol;
    const { markets } = trading_times;
    for (let i = 0; i < markets.length; i++) {
        const { submarkets } = markets[i];
        for (let j = 0; j < submarkets.length; j++) {
            const { symbols } = submarkets[j];
            symbol = symbols.find(item => item.symbol === target_symbol);
            if (symbol !== undefined) return symbol;
        }
    }
};

const calculateTimeLeft = remaining_time_to_open => {
    const difference = remaining_time_to_open - Date.now();
    return difference > 0
        ? {
              days: Math.floor(difference / (1000 * 60 * 60 * 24)),
              hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
              minutes: Math.floor((difference / 1000 / 60) % 60),
              seconds: Math.floor((difference / 1000) % 60),
          }
        : {};
};

const MarketCountdownTimer = observer(({ is_main_page, setIsTimerLoading, onMarketOpen, symbol }) => {
    const { active_symbols } = useTraderStore();
    const isMounted = useIsMounted();
    const [when_market_opens, setWhenMarketOpens] = React.useState({});
    const [time_left, setTimeLeft] = React.useState(calculateTimeLeft(when_market_opens?.remaining_time_to_open));
    const [is_loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (!is_main_page || (is_main_page && isMarketClosed(active_symbols, symbol))) {
            setLoading(true);
            // eslint-disable-next-line consistent-return
            const whenMarketOpens = async (days_offset, target_symbol) => {
                // days_offset is 0 for today, 1 for tomorrow, etc.
                if (days_offset > days_to_check_before_exit) return {};
                let remaining_time_to_open;
                const target_date = moment(new Date()).add(days_offset, 'days');
                const api_response = await getTradingTimes(target_date.format('YYYY-MM-DD'));
                if (!api_response.api_initial_load_error) {
                    const { times } = getSymbol(target_symbol, api_response.trading_times);
                    const { open, close } = times;
                    const is_closed_all_day = open?.length === 1 && open[0] === '--' && close[0] === '--';
                    if (is_closed_all_day) {
                        // check tomorrow trading times
                        return whenMarketOpens(days_offset + 1, target_symbol);
                    }
                    const date_str = target_date.toISOString().substring(0, 11);
                    const getUTCDate = hour => new Date(`${date_str}${hour}Z`);
                    for (let i = 0; i < open?.length; i++) {
                        const diff = +getUTCDate(open[i]) - Date.now();
                        if (diff > 0) {
                            remaining_time_to_open = +getUTCDate(open[i]);
                            if (isMounted() && target_symbol === symbol) {
                                return setWhenMarketOpens({
                                    days_offset,
                                    opening_time: open[i],
                                    remaining_time_to_open,
                                });
                            }
                        }
                    }
                    whenMarketOpens(days_offset + 1, target_symbol);
                }
            };

            whenMarketOpens(0, symbol);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symbol]);

    React.useEffect(() => {
        let timer;
        if (when_market_opens?.remaining_time_to_open) {
            timer = setTimeout(() => {
                setTimeLeft(calculateTimeLeft(when_market_opens.remaining_time_to_open));
                if (new Date(when_market_opens.remaining_time_to_open) - +new Date() < 1000) {
                    setLoading(true);
                    if (is_main_page) onMarketOpen(false);
                }
            }, 1000);
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [time_left, when_market_opens, onMarketOpen, is_main_page]);

    React.useEffect(() => {
        if (!is_loading) setIsTimerLoading(false);
    }, [is_loading, setIsTimerLoading]);

    let timer_components = '';

    if (Object.keys(time_left).length) {
        const hours = (time_left.days * 24 + time_left.hours).toString().padStart(2, '0');
        const minutes = time_left.minutes.toString().padStart(2, '0');
        const seconds = time_left.seconds.toString().padStart(2, '0');
        timer_components = `${hours}:${minutes}:${seconds}`;
    }

    if (!(when_market_opens && timer_components)) return null;

    const { opening_time, days_offset } = when_market_opens;
    let opening_time_banner = null;
    if (opening_time) {
        const formatted_opening_time = convertTimeFormat(opening_time);
        const target_date = moment(new Date()).add(days_offset, 'days');
        const opening_date = target_date.format('DD MMM YYYY');
        const opening_day = target_date.format('dddd');
        opening_time_banner = (
            <Text
                align='center'
                as='p'
                className='market-is-closed-overlay__open-date'
                line_height='m'
                color='prominent'
                size={is_main_page ? 's' : 'xs'}
                weight='bold'
            >
                <Localize
                    i18n_default_text='{{formatted_opening_time}} (GMT) on {{opening_day}},<0></0> {{opening_date}}.'
                    components={[<div key={0} />]}
                    values={{
                        formatted_opening_time,
                        opening_day,
                        opening_date,
                    }}
                />
            </Text>
        );
    }

    if (is_loading) setLoading(false);

    return (
        <React.Fragment>
            <Text
                as='p'
                className={classNames('market-is-closed-overlay__open-at', {
                    'market-is-closed-overlay__open-at--main-page': is_main_page,
                })}
                line_height='x'
                size={is_main_page ? 'xs' : 'xxs'}
            >
                <Localize i18n_default_text='It will reopen at' />
            </Text>
            {opening_time_banner}
            <Text
                align='center'
                as='p'
                className={classNames('market-is-closed-overlay__come-back', {
                    'market-is-closed-overlay__come-back--main-page': is_main_page,
                })}
                line_height='x'
                size={is_main_page ? 'xs' : 'xxs'}
            >
                <Localize i18n_default_text='Please come back in' />
            </Text>
            <Text
                as='p'
                className={classNames('market-is-closed-overlay__timer', {
                    'market-is-closed-overlay__timer--main-page': is_main_page,
                })}
                line_height='m'
                color='prominent'
                size={is_main_page ? 's' : 'xs'}
                weight='bold'
            >
                {timer_components}
            </Text>
            <div className='market-is-closed-overlay__separator' />
        </React.Fragment>
    );
});

MarketCountdownTimer.propTypes = {
    is_main_page: PropTypes.bool,
    setIsTimerLoading: PropTypes.func,
    onMarketOpen: PropTypes.func,
    symbol: PropTypes.string.isRequired,
};

export default MarketCountdownTimer;
