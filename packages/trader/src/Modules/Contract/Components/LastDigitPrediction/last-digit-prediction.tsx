import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { isMobile, TRADE_TYPES } from '@deriv/shared';
import DigitDisplay from './digit-display';
import LastDigitPointer from './last-digit-pointer';
import { ProposalOpenContract, TicksStreamResponse } from '@deriv/api-types';

type TLastDigitPrediction = Pick<
    React.ComponentProps<typeof DigitDisplay>,
    'barrier' | 'is_digit_contract' | 'has_entry_spot' | 'onLastDigitSpot'
> & {
    contract_type?: string;
    digits?: number[];
    digits_info: { [key: string]: { digit: number; spot: string } };
    dimension: number;
    is_ended?: boolean;
    is_trade_page?: boolean;
    onDigitChange?: (event: { target: { name: string; value: number } }) => void;
    selected_digit?: number;
    status?: ProposalOpenContract['status'];
    tick?: TicksStreamResponse['tick'];
    trade_type?: string;
};
const display_array = Array.from(Array(10).keys()); // digits array [0 - 9]

const LastDigitPrediction = ({
    barrier,
    contract_type,
    digits,
    digits_info,
    dimension,
    is_digit_contract,
    has_entry_spot,
    is_ended,
    is_trade_page,
    onDigitChange,
    onLastDigitSpot,
    selected_digit,
    status,
    tick,
    trade_type,
}: TLastDigitPrediction) => {
    const [digit_offset] = React.useState<Record<number, Record<'left' | 'top', number>>>({
        0: { left: 6, top: 0 },
        1: { left: 6 + dimension * 1, top: 0 },
        2: { left: 6 + dimension * 2, top: 0 },
        3: { left: 6 + dimension * 3, top: 0 },
        4: { left: 6 + dimension * 4, top: 0 },
        5: { left: 6 + dimension * 5, top: 0 },
        6: { left: 6 + dimension * 6, top: 0 },
        7: { left: 6 + dimension * 7, top: 0 },
        8: { left: 6 + dimension * 8, top: 0 },
        9: { left: 6 + dimension * 9, top: 0 },
    });

    const [digit_offset_mobile] = React.useState<Record<number, Record<'left' | 'top', number>>>({
        0: { left: 6, top: -60 },
        1: { left: 6 + dimension * 1, top: -60 },
        2: { left: 6 + dimension * 2, top: -60 },
        3: { left: 6 + dimension * 3, top: -60 },
        4: { left: 6 + dimension * 4, top: -60 },
        5: { left: 6 + dimension * 0, top: 8 },
        6: { left: 6 + dimension * 1, top: 8 },
        7: { left: 6 + dimension * 2, top: 8 },
        8: { left: 6 + dimension * 3, top: 8 },
        9: { left: 6 + dimension * 4, top: 8 },
    });

    const handleSelect = (digit_value: number) => {
        if (!isSelectableDigitType()) return;
        if (digit_value !== selected_digit && typeof onDigitChange === 'function') {
            onDigitChange({ target: { name: 'last_digit', value: digit_value } });
        }
    };

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

    const getOffset = () => (isMobile() ? digit_offset_mobile : digit_offset);

    const isSelectableDigitType = () => (isMobile() ? trade_type !== TRADE_TYPES.EVEN_ODD : false);
    const digits_array = Object.keys(digits_info)
        .sort((a, b) => +a - +b)
        .map(spot_time => digits_info[+spot_time]);
    const last_contract_digit = digits_array.slice(-1)[0] || {};

    // 'won' or 'lost' status exists after contract expiry
    const is_won = is_ended && status === 'won' && is_digit_contract;
    // need to explicitly have is_lost condition here
    // because negating is_won would always be true,
    // but we only need is_lost condition only once we have the 'won' or 'lost' status
    const is_lost = is_ended && status === 'lost' && is_digit_contract;

    const min = digits ? Math.min(...digits) : null;
    const max = digits ? Math.max(...digits) : null;

    // latest last digit refers to digit and spot values from latest price
    // latest contract digit refers to digit and spot values from last digit contract in contracts array
    const latest_tick_pip_size = tick ? +tick.pip_size : null;
    const latest_tick_quote_price =
        tick?.quote && latest_tick_pip_size ? tick.quote.toFixed(latest_tick_pip_size) : null;
    const latest_tick_digit = latest_tick_quote_price ? +(latest_tick_quote_price.split('').pop() || '') : null;
    const position = tick ? getOffset()[latest_tick_digit ?? -1] : getOffset()[last_contract_digit.digit];
    const latest_digit = !(is_won || is_lost)
        ? { digit: latest_tick_digit, spot: latest_tick_quote_price }
        : last_contract_digit;
    return (
        <div
            className={classNames('digits', {
                'digits--trade': is_trade_page,
            })}
        >
            {display_array.map(idx => (
                <DigitDisplay
                    barrier={getBarrier(idx)}
                    has_entry_spot={has_entry_spot}
                    is_digit_contract={is_digit_contract}
                    is_lost={is_lost}
                    is_won={is_won}
                    key={idx}
                    is_max={digits ? digits[idx] === max : null}
                    is_min={digits ? digits[idx] === min : null}
                    stats={digits ? digits[idx] : null}
                    status={status}
                    latest_digit={is_trade_page ? latest_digit : last_contract_digit}
                    value={idx}
                    onLastDigitSpot={onLastDigitSpot}
                    onSelect={isSelectableDigitType() ? handleSelect : null}
                    selected_digit={isSelectableDigitType() ? selected_digit : undefined}
                />
            ))}
            <LastDigitPointer is_lost={is_lost} is_trade_page={is_trade_page} is_won={is_won} position={position} />
        </div>
    );
};

export default observer(LastDigitPrediction);
