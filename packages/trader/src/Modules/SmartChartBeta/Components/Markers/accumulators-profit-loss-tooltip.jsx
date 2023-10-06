import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { Money, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { FastMarkerBeta } from 'Modules/SmartChartBeta';
import AccumulatorsProfitLossTextBeta from './accumulators-profit-loss-text';
import { isMobile } from '@deriv/shared';

const AccumulatorsProfitLossTooltipBeta = ({
    alignment = 'right',
    current_spot,
    current_spot_time,
    className = 'sc-accumulators-profit-loss-tooltip',
    currency,
    exit_tick,
    exit_tick_time,
    high_barrier,
    is_sold,
    profit,
    should_show_profit_text,
}) => {
    const [is_tooltip_open, setIsTooltipOpen] = React.useState(false);
    const won = profit >= 0;
    const tooltip_timeout = React.useRef(null);

    React.useEffect(() => {
        return () => {
            clearTimeout(tooltip_timeout.current);
        };
    }, []);

    React.useEffect(() => {
        if (is_sold) {
            setIsTooltipOpen(true);
            tooltip_timeout.current = onCloseDelayed(3000);
        }
    }, [is_sold]);

    const onCloseDelayed = duration =>
        setTimeout(() => {
            setIsTooltipOpen(false);
        }, duration);

    const onHoverOrTapHandler = () => {
        clearTimeout(tooltip_timeout.current);
        tooltip_timeout.current = onCloseDelayed(1500);
    };

    const opposite_arrow_position = React.useMemo(() => {
        const horizontal = ['left', 'right'];
        return horizontal.includes(alignment)
            ? horizontal.find(el => el !== alignment)
            : ['top', 'bottom'].find(el => el !== alignment);
    }, [alignment]);

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

    if (typeof profit !== 'number') return null;
    if (!is_sold && current_spot_time && high_barrier && should_show_profit_text)
        return (
            <AccumulatorsProfitLossTextBeta
                currency={currency}
                current_spot={current_spot}
                current_spot_time={current_spot_time}
                profit={profit}
            />
        );
    return is_sold && exit_tick_time ? (
        <FastMarkerBeta markerRef={onRef} className={classNames(className, won ? 'won' : 'lost')}>
            <span
                className={`${className}__spot-circle`}
                onMouseEnter={() => setIsTooltipOpen(true)}
                onMouseLeave={onHoverOrTapHandler}
                onTouchStart={() => setIsTooltipOpen(true)}
                onTouchEnd={onHoverOrTapHandler}
                data-testid='dt_accumulator_tooltip_spot'
            />
            <CSSTransition
                in={is_tooltip_open}
                timeout={{
                    exit: 500,
                }}
                unmountOnExit
                classNames={`${className}__content`}
            >
                <div className={classNames(`${className}__content`, `arrow-${opposite_arrow_position}`)}>
                    <Text size={isMobile() ? 'xxxxs' : 'xxs'} className={`${className}__text`}>
                        {localize('Total profit/loss:')}
                    </Text>
                    <Text size={isMobile() ? 'xxxs' : 'xs'} className={`${className}__text`} weight='bold'>
                        <Money amount={profit} currency={currency} has_sign show_currency />
                    </Text>
                </div>
            </CSSTransition>
        </FastMarkerBeta>
    ) : null;
};

AccumulatorsProfitLossTooltipBeta.propTypes = {
    alignment: PropTypes.string,
    current_spot: PropTypes.number,
    current_spot_time: PropTypes.number,
    className: PropTypes.string,
    currency: PropTypes.string,
    exit_tick: PropTypes.number,
    exit_tick_time: PropTypes.number,
    high_barrier: PropTypes.string,
    is_sold: PropTypes.number,
    profit: PropTypes.number,
    should_show_profit_text: PropTypes.bool,
};

export default React.memo(AccumulatorsProfitLossTooltipBeta);
