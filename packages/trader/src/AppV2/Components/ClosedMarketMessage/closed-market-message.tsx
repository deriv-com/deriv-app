import React from 'react';
import { useIsMounted, WS, isMarketClosed, toMoment } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { TradingTimesRequest } from '@deriv/api-types';
import useActiveSymbols from 'AppV2/Hooks/useActiveSymbols';
import MarketOpeningTimeBanner from '../MarketOpeningTimeBanner';
import MarketCountdownTimer from '../MarketCountdownTimer';
import { CaptionText } from '@deriv-com/quill-ui';
import clsx from 'clsx';
import { calculateTimeLeft, getSymbol } from 'AppV2/Utils/closed-market-message-utils';

type TWhenMarketOpens = {
    days_offset: number;
    opening_time: string;
    remaining_time_to_open: number;
};

const days_to_check_before_exit = 7;

const getTradingTimes = async (target_time: TradingTimesRequest['trading_times']) => {
    const data = await WS.tradingTimes(target_time);
    if (data.error) {
        return { api_initial_load_error: data.error.message };
    }
    return data;
};

const ClosedMarketMessage = observer(() => {
    const { common } = useStore();
    const { current_language } = common;
    const { symbol, prepareTradeStore } = useTraderStore();
    const { activeSymbols } = useActiveSymbols();

    const isMounted = useIsMounted();
    const [when_market_opens, setWhenMarketOpens] = React.useState<TWhenMarketOpens>({} as TWhenMarketOpens);
    const [time_left, setTimeLeft] = React.useState(calculateTimeLeft(when_market_opens?.remaining_time_to_open));
    const [is_loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (isMarketClosed(activeSymbols, symbol)) {
            setLoading(true);
            const whenMarketOpens = async (
                days_offset: number,
                target_symbol: string
            ): Promise<void | Record<string, unknown>> => {
                if (days_offset > days_to_check_before_exit) return {};
                let remaining_time_to_open;
                const target_date = toMoment(new Date()).add(days_offset, 'days');
                const api_response = await getTradingTimes(target_date.format('YYYY-MM-DD'));
                if (!api_response.api_initial_load_error) {
                    const returned_symbol = getSymbol(target_symbol, api_response.trading_times);
                    const open = returned_symbol?.times.open as string[];
                    const close = returned_symbol?.times.close as string[];
                    const is_closed_all_day = open?.length === 1 && open[0] === '--' && close[0] === '--';
                    if (is_closed_all_day) {
                        return whenMarketOpens(days_offset + 1, target_symbol);
                    }
                    const date_str = target_date.toISOString().substring(0, 11);
                    const getUTCDate = (hour: string) => new Date(`${date_str}${hour}Z`);
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
        setTimeLeft({});
        setWhenMarketOpens({} as TWhenMarketOpens);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symbol, activeSymbols]);

    React.useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (when_market_opens?.remaining_time_to_open) {
            timer = setTimeout(() => {
                setTimeLeft(calculateTimeLeft(when_market_opens.remaining_time_to_open));
                if (+new Date(when_market_opens.remaining_time_to_open) - +new Date() < 1000) {
                    setLoading(true);
                    prepareTradeStore(false);
                }
            }, 1000);
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [time_left, when_market_opens, prepareTradeStore]);

    if (!(when_market_opens && Object.keys(time_left).length) || !isMarketClosed(activeSymbols, symbol)) return null;

    const { opening_time, days_offset } = when_market_opens;

    if (is_loading) setLoading(false);

    return (
        <div className={clsx('closed-market-message--container', { 'closed-market-message--loading': is_loading })}>
            <div className='closed-market-message--left'>
                <CaptionText className='closed-market-message--left-message'>
                    <Localize i18n_default_text='This market will reopen at' />
                </CaptionText>
                <MarketOpeningTimeBanner
                    opening_time={opening_time}
                    days_offset={days_offset}
                    current_language={current_language}
                />
            </div>
            <MarketCountdownTimer time_left={time_left} />
        </div>
    );
});

export default ClosedMarketMessage;
