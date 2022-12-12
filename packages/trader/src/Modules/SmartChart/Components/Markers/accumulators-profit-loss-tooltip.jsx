import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { FastMarker } from 'Modules/SmartChart';
import AccumulatorsProfitLossText from './accumulators-profit-loss-text';

const AccumulatorsProfitLossTooltip = ({
    alignment = 'right',
    current_spot,
    current_spot_time = 0,
    className = 'sc-accumulators-profit-loss-tooltip',
    currency,
    exit_tick = 0,
    exit_tick_time = 0,
    is_sold,
    profit,
}) => {
    const [is_tooltip_open, setIsTooltipOpen] = React.useState(true);
    const won = profit > 0;
    const sign = won ? '+' : '';
    const tooltip_timeout = React.useRef(null);
    const is_mobile = isMobile();

    React.useEffect(() => {
        return () => clearTimeout(tooltip_timeout.current);
    }, []);

    React.useEffect(() => {
        if (is_sold) {
            tooltip_timeout.current = onCloseDelayed(5000);
        }
    }, [is_sold]);

    const onCloseDelayed = duration =>
        setTimeout(() => {
            setIsTooltipOpen(false);
        }, duration);

    const opposite_arrow_position = React.useMemo(() => {
        const horizontal = ['left', 'right'];
        return horizontal.includes(alignment)
            ? horizontal.find(el => el !== alignment)
            : ['top', 'bottom'].find(el => el !== alignment);
    }, [alignment]);

    const onClickMobileHandler = () => {
        if (is_mobile) {
            setIsTooltipOpen(true);
            tooltip_timeout.current = onCloseDelayed(2000);
        }
    };

    const onRef = ref => {
        if (ref) {
            if (!exit_tick) {
                // this call will hide the marker:
                ref.setPosition({ epoch: null, price: null });
            }
            ref.setPosition({
                epoch: +exit_tick_time,
                price: +exit_tick,
            });
        }
    };

    if (!is_sold && typeof profit === 'number')
        return (
            <AccumulatorsProfitLossText
                currency={currency}
                current_spot={current_spot}
                current_spot_time={current_spot_time}
                profit={profit}
            />
        );

    if (typeof profit !== 'number') return null;

    return (
        <FastMarker markerRef={onRef} className={classNames(className, won ? 'won' : 'lost')}>
            <span
                className={`${className}__spot-circle`}
                onMouseEnter={() => setIsTooltipOpen(true)}
                onMouseLeave={() => setIsTooltipOpen(false)}
                // onTouchStart for open tooltip on mobile
                onTouchStart={onClickMobileHandler}
            />
            <CSSTransition
                in={is_tooltip_open}
                timeout={{
                    appear: 500,
                    enter: 0,
                    exit: 500,
                }}
                unmountOnExit
                classNames={{
                    appear: `${className}__content--enter`,
                    enter: `${className}__content--enter`,
                    enterDone: `${className}__content--enter-done`,
                    exit: `${className}__content--exit`,
                }}
            >
                <div className={classNames(`${className}__content`, `arrow-${opposite_arrow_position}`)}>
                    <Text size='xxs' className={`${className}__text`}>
                        {localize('Total profit/loss:')}
                    </Text>
                    <Text
                        size='xs'
                        className={`${className}__text`}
                        weight='bold'
                    >{`${sign}${profit} ${currency}`}</Text>
                </div>
            </CSSTransition>
        </FastMarker>
    );
};

AccumulatorsProfitLossTooltip.propTypes = {
    alignment: PropTypes.string,
    current_spot: PropTypes.number,
    current_spot_time: PropTypes.number,
    className: PropTypes.string,
    currency: PropTypes.string,
    exit_tick: PropTypes.number,
    exit_tick_time: PropTypes.number,
    is_sold: PropTypes.number,
    profit: PropTypes.number,
};

export default React.memo(AccumulatorsProfitLossTooltip);
