import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';
import { connect } from 'Stores/connect';

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
// eslint-disable-next-line consistent-return
const whenMarketOpens = async (days_offset, target_symbol) => {
    // days_offset is 0 for today, 1 for tomorrow, etc.
    if (days_offset > days_to_check_before_exit) return undefined;
    let when_market_opens;
    const date_target = new Date();
    date_target.setDate(date_target.getDate() + days_offset);
    const date = moment(date_target).format('YYYY-MM-DD');
    const api_res = await getTradingTimes(date);
    if (!api_res.api_initial_load_error) {
        const { times } = getSymbol(target_symbol, api_res.trading_times);
        const { open, close } = times;
        const is_closed_all_day = open?.length === 1 && open[0] === '--' && close[0] === '--';
        if (is_closed_all_day) {
            // check tomorrow trading times
            when_market_opens = await whenMarketOpens(days_offset + 1, target_symbol);
            return when_market_opens;
        }
        const date_str = date_target.toISOString().substring(0, 11);
        const getUTCDate = hour => new Date(`${date_str}${hour}Z`);
        for (let i = 0; i < open?.length; i++) {
            const diff = +getUTCDate(open[i]) - +new Date();
            if (diff > 0) {
                when_market_opens = +getUTCDate(open[i]);
                return when_market_opens;
            }
        }
        when_market_opens = await whenMarketOpens(days_offset + 1, target_symbol);
        return when_market_opens;
    }
};

const calculateTimeLeft = when_market_opens => {
    const difference = when_market_opens - +new Date();
    let timeLeft = {};

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    return timeLeft;
};

const padWithZero = number => {
    if (number < 10) {
        return `0${number}`;
    }
    return number;
};

const MarketCountdownTimer = ({ is_main_page, symbol }) => {
    const [when_market_opens, setWhenMarketOpens] = React.useState();
    const [time_left, setTimeLeft] = React.useState(calculateTimeLeft(when_market_opens));

    React.useEffect(() => {
        let is_subscribed = true;
        async function fetchTradingTimes() {
            const response = await whenMarketOpens(0, symbol);
            if (is_subscribed) setWhenMarketOpens(response);
        }
        fetchTradingTimes();

        return () => (is_subscribed = false);
    }, []);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft(when_market_opens));
        }, 1000);

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [time_left]);

    let timer_components = '';

    Object.keys(time_left).forEach(interval => {
        if (interval === 'days' && time_left.days) {
            timer_components += `${time_left.days} ${interval} `;
        } else {
            const value = time_left[interval];
            timer_components += interval !== 'seconds' ? `${padWithZero(value)}:` : `${padWithZero(value)}`;
        }
    });

    if (!(when_market_opens && timer_components)) return null;

    return (
        <React.Fragment>
            <Text as='p'>
                <Localize i18n_default_text='Reopens:' />
            </Text>
            <Text
                as='p'
                className={classNames('market-is-closed-overlay__timer', {
                    'market-is-closed-overlay__timer--main-page': is_main_page,
                })}
            >
                {timer_components} GMT
            </Text>
            <div className='market-is-closed-overlay__separator' />
        </React.Fragment>
    );
};

MarketCountdownTimer.propTypes = {
    is_main_page: PropTypes.bool,
    symbol: PropTypes.string.isRequired,
};

export default connect(({ modules }) => ({
    symbol: modules.trade.symbol,
}))(MarketCountdownTimer);
