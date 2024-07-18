import React from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { Heading, Text } from '@deriv-com/quill-ui';
import { useTraderStore } from 'Stores/useTraderStores';
import { Skeleton } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { isContractElapsed } from '@deriv/shared';
import { toJS } from 'mobx';
import { TickSpotData } from '@deriv/api-types';
import { Localize } from '@deriv/translations';

type TCurrentSpotProps = {
    className?: string;
};

const STATUS = {
    LOST: 'lost',
    WON: 'won',
};

const CurrentSpot = observer(({ className }: TCurrentSpotProps) => {
    const { contract_trade } = useStore();
    const { last_contract } = contract_trade;
    const { contract_info = {}, digits_info = {}, display_status, is_digit_contract, is_ended } = last_contract;
    const { digit_tick, symbol, setDigitTick } = useTraderStore();

    let tick = digit_tick;

    const is_contract_elapsed = isContractElapsed(contract_info, tick);
    const status = !is_contract_elapsed && !!tick ? display_status : null;
    const { date_start, contract_type, underlying } = contract_info;

    // tick from contract_info.tick_stream differs from a ticks_history API tick.
    if (date_start && !is_contract_elapsed) {
        const tick_stream = contract_info.tick_stream;
        if (tick_stream?.length) {
            const t = toJS(tick_stream.slice(-1)[0]);
            tick = {
                ask: t.tick,
                bid: t.tick,
                epoch: t.epoch,
                pip_size: t.tick_display_value?.split('.')[1].length,
                quote: t.tick,
                current_tick: tick_stream.length,
            } as TickSpotData;
        }
    }
    const current_tick = tick && 'current_tick' in tick ? tick.current_tick : null;
    // 'won' or 'lost' status exists after contract expiry:
    const is_digit_contract_ended = is_ended && is_digit_contract;
    const is_won = is_digit_contract_ended && status === STATUS.WON;
    const is_lost = is_digit_contract_ended && status === STATUS.LOST;
    const digits_array = Object.keys(digits_info)
        .sort((a, b) => +a - +b)
        .map(spot_time => digits_info[+spot_time]);
    // last_contract_digit refers to digit and spot values from last digit contract in contracts array:
    const last_contract_digit = digits_array.slice(-1)[0] || {};
    const latest_tick_pip_size = tick ? +tick.pip_size : null;
    const latest_tick_quote_price =
        tick?.quote && latest_tick_pip_size ? tick.quote.toFixed(latest_tick_pip_size) : null;
    const latest_tick_digit = latest_tick_quote_price ? +(latest_tick_quote_price.split('').pop() || '') : null;
    // latest_digit refers to digit and spot values from the latest price:
    const latest_digit = !(is_won || is_lost)
        ? { digit: latest_tick_digit, spot: latest_tick_quote_price }
        : (last_contract_digit as { digit: number | null; spot: string | null });

    const barrier = !is_contract_elapsed && !!tick ? Number(contract_info.barrier) : null;
    const getBarrier = (num: number | null): number | null => {
        const barrier_map: {
            [key: string]: (val: number | null) => boolean;
        } = {
            DIGITMATCH: (val: number | null) => val === barrier,
            DIGITDIFF: (val: number | null) => val !== barrier,
            DIGITOVER: (val: number | null) => !!((val || val === 0) && (barrier || barrier === 0)) && val > barrier,
            DIGITUNDER: (val: number | null) => !!((val || val === 0) && (barrier || barrier === 0)) && val < barrier,
            DIGITODD: (val: number | null) => !!val && Boolean(val % 2),
            DIGITEVEN: (val: number | null) => (!!val && !(val % 2)) || val === 0,
        };
        if (!contract_type || !barrier_map[contract_type]) return null;
        return barrier_map[contract_type](num) ? num : null;
    };
    const is_selected_winning = latest_digit.digit === getBarrier(latest_digit.digit);
    const has_contract = is_digit_contract && status && latest_digit.spot && !!contract_info.entry_tick;
    const has_open_contract = has_contract && !is_ended;
    const has_relevant_tick_data = underlying === symbol || !underlying;

    /* TODO: add animation with gradual transition from prev_spot to the current spot:
    const prev_spot = React.useRef(latest_digit.spot); */

    React.useEffect(() => {
        // TODO: move this logic to Assets feature when it's available:
        setDigitTick(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symbol]);

    return (
        <div
            className={clsx(
                'trade__current-spot',
                className,
                has_contract && has_relevant_tick_data && 'trade__current-spot--has-contract'
            )}
        >
            {tick && has_relevant_tick_data ? (
                <React.Fragment>
                    {has_contract && (
                        <Text size='xl'>
                            <Localize i18n_default_text='Tick {{current_tick}}' values={{ current_tick }} />
                        </Text>
                    )}
                    <div className='current-spot'>
                        <Text size='xl' bold>
                            {latest_digit.spot?.slice(0, -1)}
                        </Text>
                        <Heading.H2
                            className={clsx(
                                'current-spot__last-digit',
                                (is_won || (has_open_contract && is_selected_winning)) &&
                                    'current-spot__last-digit--won',
                                (is_lost || (has_open_contract && !is_selected_winning)) &&
                                    'current-spot__last-digit--lost'
                            )}
                        >
                            {latest_digit.spot?.slice(-1)}
                        </Heading.H2>
                    </div>
                </React.Fragment>
            ) : (
                <Skeleton width={128} height={32} />
            )}
        </div>
    );
});

export default CurrentSpot;
