import PropTypes from 'prop-types';
import React from 'react';
import { Text } from '@deriv/components';
import { FastMarker } from 'Modules/SmartChart';
import classNames from 'classnames';

const AccumulatorsProfitLossText = ({
    current_spot,
    current_spot_time = 0,
    currency,
    className = 'sc-accumulators-profit-loss-text',
    profit,
}) => {
    const [value, setValue] = React.useState(0);
    const timeout_ids = React.useRef([]);
    const counter = React.useRef(null);
    const prev_profit = React.useRef(profit);
    const animated_ref = React.useRef();
    const won = profit > 0;
    const sign = won ? '+' : '';
    const new_arr = profit.toFixed(2).split('.');
    const prev_arr = prev_profit.current?.toFixed(2).split('.');
    const new_counter = +new_arr[1][0];
    const prev_counter = +prev_arr[1][0];

    React.useEffect(() => {
        if (animated_ref?.current) {
            animated_ref.current.animate(
                [
                    { transform: 'translateY(0)', opacity: '1' },
                    { transform: 'translateY(-15px)', opacity: '0.2' },
                    { transform: 'translateY(-30px)', opacity: '0' },
                    { transform: 'translateY(-15px)', opacity: '0.2' },
                    { transform: 'translateY(0)', opacity: '1' },
                ],
                {
                    duration: 20,
                    fill: 'both',
                    iterations: 15,
                    easing: 'cubic-bezier(.49,-.4,.11,.65)',
                }
            );
        }
        update(prev_counter, new_counter);
        const timeouts = timeout_ids.current;
        return () => {
            timeouts?.forEach(id => {
                clearTimeout(id);
            });
        };
    }, [profit]);

    // TODO: maryia-binary: refactor this function
    const update = (start, end) => {
        timeout_ids.current.forEach(id => {
            clearTimeout(id);
        });

        const delta = Math.abs(end - start) || 1;
        counter.current = start;
        if (start < end) {
            const runLoop = () => {
                const timeout_id = setTimeout(() => {
                    if (counter.current < end) {
                        counter.current = (counter.current + 1) % 10;
                        setValue(counter.current % 10);

                        runLoop();
                    } else if (counter.current === end) {
                        setValue(counter.current % 10);
                    }
                }, 300 / delta);
                timeout_ids.current.push(timeout_id);
            };

            runLoop();
        } else if (start > end) {
            const runLoop = () => {
                const timeout_id = setTimeout(() => {
                    if (counter.current > end) {
                        counter.current = Math.abs(counter.current - 1) % 10;
                        setValue(counter.current % 10);

                        runLoop();
                    } else if (counter.current === end) {
                        setValue(counter.current % 10);
                    }
                }, 300 / delta);
                timeout_ids.current.push(timeout_id);
            };

            runLoop();
        } else {
            const runLoop = () => {
                const timeout_id = setTimeout(() => {
                    if (counter.current < start + 10) {
                        counter.current += 1;
                        setValue(counter.current % 10);

                        runLoop();
                    } else if (counter.current === start + 10) {
                        setValue(counter.current % 10);
                    }
                }, 30);
                timeout_ids.current.push(timeout_id);
            };

            runLoop();
        }
    };

    const onRef = ref => {
        if (ref) {
            if (!current_spot) {
                // this call will hide the marker:
                ref.setPosition({ epoch: null, price: null });
            }
            ref.setPosition({
                epoch: +current_spot_time,
                price: +current_spot,
            });
        }
    };

    return (
        <FastMarker markerRef={onRef} className={classNames(className, won ? 'won' : 'lost')}>
            <Text
                weight='bold'
                size='m'
                color={won ? 'profit-success' : 'loss-danger'}
                className={`${className}__profit`}
                as='div'
            >
                {`${sign}${new_arr[0]}.`}
                <div ref={animated_ref}>{value}</div>
                {`${new_arr[1].slice(1)}`}
            </Text>
            <Text size='xxs' as='div' className={`${className}__currency`}>
                {currency}
            </Text>
        </FastMarker>
    );
};

AccumulatorsProfitLossText.propTypes = {
    className: PropTypes.string,
    currency: PropTypes.string,
    current_spot: PropTypes.number,
    current_spot_time: PropTypes.number,
    profit: PropTypes.number,
};

export default React.memo(AccumulatorsProfitLossText);
