import React from 'react';
import { Text } from '@deriv/components';
import { FastMarker } from 'Modules/SmartChart';
import classNames from 'classnames';
import AccumulatorsProfitLossTooltip, { TRef } from './accumulators-profit-loss-tooltip';

type TAccumulatorsProfitLossText = Omit<
    React.ComponentProps<typeof AccumulatorsProfitLossTooltip>,
    'alignment' | 'exit_tick' | 'exit_tick_time' | 'high_barrier' | 'is_sold'
>;

const ACTIONS = {
    INC: 'increment',
    DEC: 'decrement',
    ADD10: 'add10',
} as const;

const AccumulatorsProfitLossText = ({
    current_spot,
    current_spot_time,
    currency,
    className = 'sc-accumulators-profit-loss-text',
    profit,
}: TAccumulatorsProfitLossText) => {
    const [is_fading_in, setIsFadingIn] = React.useState(false);
    const [is_sliding, setIsSliding] = React.useState(false);
    const prev_profit = React.useRef<number>(profit);
    const prev_profit_tenth = +prev_profit.current?.toFixed(2).split('.')[1][0];
    const [current_profit_tenth, setCurrentProfitTenth] = React.useState(prev_profit_tenth);
    const profit_tenth_ref = React.useRef(0);
    const interval_id_ref = React.useRef<ReturnType<typeof setInterval>>();
    const fading_in_timeout_id = React.useRef<ReturnType<typeof setTimeout>>();
    const sliding_timeout_id = React.useRef<ReturnType<typeof setTimeout>>();
    const profit_portions_array = profit.toFixed(2).split('.');
    const profit_whole_number = +profit_portions_array[0];
    const profit_tenth = +profit_portions_array[1][0];
    const profit_hundredths = +profit_portions_array[1].slice(1);
    const won = profit >= 0;
    const sign = profit > 0 ? '+' : '';

    const runThroughTenthDigit = (
        action: typeof ACTIONS[keyof typeof ACTIONS],
        interval_ms: number,
        start: number,
        end: number
    ) => {
        clearInterval(interval_id_ref.current);
        const interval_id = setInterval(() => {
            if (action === ACTIONS.INC && profit_tenth_ref.current < end) {
                profit_tenth_ref.current = (profit_tenth_ref.current + 1) % 10;
            } else if (action === ACTIONS.DEC && profit_tenth_ref.current > end) {
                profit_tenth_ref.current = Math.abs(profit_tenth_ref.current - 1) % 10;
            } else if (action === ACTIONS.ADD10 && profit_tenth_ref.current < start + 10) {
                profit_tenth_ref.current += 1;
            } else if (
                action === ACTIONS.ADD10 ? profit_tenth_ref.current === start + 10 : profit_tenth_ref.current === end
            ) {
                clearInterval(interval_id);
            }
            setCurrentProfitTenth(profit_tenth_ref.current % 10);
        }, interval_ms);
        interval_id_ref.current = interval_id;
    };

    React.useEffect(() => {
        if (profit) {
            setIsFadingIn(true);
            setIsSliding(true);
            fading_in_timeout_id.current = setTimeout(() => {
                setIsFadingIn(false);
            }, 600);
            sliding_timeout_id.current = setTimeout(() => {
                setIsSliding(false);
            }, 300);
        }
        if (profit !== 0) {
            const updateTenth = (start: number, end: number) => {
                const delta = Math.abs(end - start);
                profit_tenth_ref.current = start;
                if (start < end) {
                    runThroughTenthDigit(ACTIONS.INC, 300 / delta, start, end);
                } else if (start > end) {
                    runThroughTenthDigit(ACTIONS.DEC, 300 / delta, start, end);
                } else {
                    runThroughTenthDigit(ACTIONS.ADD10, 30, start, end);
                }
            };
            updateTenth(prev_profit_tenth, profit_tenth);
        }
        return () => {
            clearTimeout(fading_in_timeout_id.current);
            clearTimeout(sliding_timeout_id.current);
            clearInterval(interval_id_ref.current);
        };
    }, [profit, prev_profit_tenth, profit_tenth]);

    const onRef = (ref: TRef | null): void => {
        if (ref) {
            if (!current_spot) {
                // this call will hide the marker:
                ref.setPosition({ epoch: null, price: null });
            }
            if (current_spot && current_spot_time) {
                ref.setPosition({
                    epoch: +current_spot_time,
                    price: +current_spot,
                });
            }
        }
    };

    return (
        <FastMarker markerRef={onRef} className={classNames(className, won ? 'won' : 'lost')}>
            <Text
                weight='bold'
                size='m'
                color={won ? 'profit-success' : 'loss-danger'}
                className={classNames(`${className}__profit`, {
                    [`${className}__profit--fading-in`]: is_fading_in,
                })}
                data-testid='dt_accumulator_profit_text'
            >
                {`${sign}${profit_whole_number}.`}
                <div className={is_sliding ? `${className}__sliding-tenth` : ''}>{current_profit_tenth}</div>
                {`${profit_hundredths}`}
            </Text>
            <Text size='xxs' as='div' className={`${className}__currency`}>
                {currency}
            </Text>
        </FastMarker>
    );
};

export default React.memo(AccumulatorsProfitLossText);
