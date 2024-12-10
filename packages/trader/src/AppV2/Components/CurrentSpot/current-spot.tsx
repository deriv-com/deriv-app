import React from 'react';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { useTraderStore } from 'Stores/useTraderStores';
import { Skeleton, usePrevious } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { isContractElapsed } from '@deriv/shared';
import { toJS } from 'mobx';
import { TickSpotData } from '@deriv/api-types';
import CurrentSpotDisplay from './current-spot-display';
import { isDigitContractWinning } from 'AppV2/Utils/trade-params-utils';

const STATUS = {
    LOST: 'lost',
    WON: 'won',
};

const CurrentSpot = observer(() => {
    const contract_switching_timer = React.useRef<ReturnType<typeof setTimeout>>();

    const { contract_trade } = useStore();
    const { last_contract, prev_contract } = contract_trade;
    const {
        contract_info = {},
        digits_info = {},
        display_status,
        is_digit_contract,
        is_ended,
    } = last_contract.contract_info?.entry_tick || !prev_contract ? last_contract : prev_contract;
    const { tick_data, symbol } = useTraderStore();
    const { contract_id, entry_tick, date_start, contract_type, tick_stream, underlying } = contract_info;
    const prev_contract_id = usePrevious(contract_id);
    const last_contract_ticks = last_contract.contract_info?.tick_stream?.length;
    const prev_last_contract_ticks = usePrevious(last_contract_ticks);

    let tick = tick_data;

    const is_contract_elapsed = isContractElapsed(contract_info, tick);
    const is_prev_contract_elapsed = isContractElapsed(prev_contract?.contract_info, tick);
    const status = !is_contract_elapsed && !!tick ? display_status : null;

    // tick from contract_info.tick_stream differs from a ticks_history API tick.
    if (date_start && !is_contract_elapsed) {
        if (tick_stream?.length) {
            const { epoch, tick: latest_stream_tick, tick_display_value } = toJS(tick_stream.slice(-1)[0]);
            tick = {
                ask: latest_stream_tick,
                bid: latest_stream_tick,
                epoch,
                pip_size: tick_display_value?.split('.')[1].length,
                quote: latest_stream_tick,
                current_tick: tick_stream.length,
            } as TickSpotData;
        }
    }
    const current_tick = tick && 'current_tick' in tick ? (tick.current_tick as number) : null;
    // 'won' or 'lost' status exists after contract expiry:
    const is_digit_contract_ended = is_ended && is_digit_contract;
    const is_won = is_digit_contract_ended && status === STATUS.WON;
    const is_lost = is_digit_contract_ended && status === STATUS.LOST;
    const digits_array = Object.keys(digits_info)
        .sort((a, b) => +a - +b)
        .map(spot_time => digits_info[+spot_time]);
    // last_contract_digit refers to digit and spot values from last digit contract in contracts array:
    const last_contract_digit = React.useMemo(() => digits_array.slice(-1)[0] || {}, [digits_array]);
    const latest_tick_pip_size = tick ? +tick.pip_size : null;
    const latest_tick_quote_price =
        tick?.quote && latest_tick_pip_size ? tick.quote.toFixed(latest_tick_pip_size) : null;
    const latest_tick_digit = latest_tick_quote_price ? +(latest_tick_quote_price.split('').pop() || '') : null;
    // latest_digit refers to digit and spot values from the latest price:
    const latest_digit = React.useMemo(
        () =>
            is_won || is_lost
                ? (last_contract_digit as { digit: number | null; spot: string | null })
                : { digit: latest_tick_digit, spot: latest_tick_quote_price },
        [is_won, is_lost, latest_tick_digit, latest_tick_quote_price, last_contract_digit]
    );

    const [displayed_tick, setDisplayedTick] = React.useState<number | null>(current_tick);
    const [displayed_spot, setDisplayedSpot] = React.useState<string | null>(latest_digit.spot);
    const [should_enter_from_top, setShouldEnterFromTop] = React.useState(false);

    const barrier = !is_contract_elapsed && !!tick ? Number(contract_info.barrier) : null;
    const is_winning = isDigitContractWinning(contract_type, barrier, latest_digit.digit);
    const has_contract = is_digit_contract && status && latest_digit.spot && !!entry_tick;
    const has_open_contract = has_contract && !is_ended;
    const has_relevant_tick_data = underlying === symbol || !underlying;
    const should_show_tick_count = has_contract && has_relevant_tick_data;
    const should_enter_from_left =
        !prev_contract?.contract_info ||
        !!(is_prev_contract_elapsed && last_contract_ticks === 1 && !prev_last_contract_ticks);

    const setNewData = React.useCallback(() => {
        setDisplayedTick(current_tick);
        setDisplayedSpot(latest_digit.spot);
    }, [current_tick, latest_digit.spot]);

    React.useEffect(() => {
        const has_multiple_contracts =
            prev_contract?.contract_info && !is_prev_contract_elapsed && last_contract.contract_info?.entry_tick;
        const is_next_contract_opened = prev_contract_id && contract_id && prev_contract_id !== contract_id;
        if (has_multiple_contracts && is_next_contract_opened) {
            setShouldEnterFromTop(true);
            contract_switching_timer.current = setTimeout(() => {
                setShouldEnterFromTop(false);
                setNewData();
            }, 240); // equal to animation duration
        } else if (!should_enter_from_top) {
            setNewData();
        }
    }, [
        contract_id,
        is_prev_contract_elapsed,
        last_contract,
        prev_contract,
        prev_contract_id,
        setNewData,
        should_enter_from_top,
    ]);

    React.useEffect(() => {
        return () => {
            clearTimeout(contract_switching_timer.current);
        };
    }, []);

    return (
        <div
            className={clsx(
                'trade__current-spot',
                should_show_tick_count && 'trade__current-spot--has-contract',
                should_show_tick_count && should_enter_from_left && 'trade__current-spot--enter-from-left',
                !should_show_tick_count && is_contract_elapsed && 'trade__current-spot--enter-from-right',
                has_open_contract && is_winning && 'trade__current-spot--winning',
                is_won && 'trade__current-spot--won',
                has_open_contract && !is_winning && 'trade__current-spot--losing',
                is_lost && 'trade__current-spot--lost'
            )}
        >
            {tick && has_relevant_tick_data && displayed_spot ? (
                <div
                    className={clsx(
                        'current-spot__wrapper',
                        should_enter_from_top && 'current-spot__wrapper--enter-from-top'
                    )}
                >
                    {should_enter_from_top && (
                        <CurrentSpotDisplay
                            has_tick_count={!!has_contract}
                            spot={latest_digit.spot}
                            tick={current_tick}
                        />
                    )}
                    <CurrentSpotDisplay has_tick_count={!!has_contract} spot={displayed_spot} tick={displayed_tick} />
                </div>
            ) : (
                <Skeleton width={128} height={32} />
            )}
        </div>
    );
});

export default CurrentSpot;
