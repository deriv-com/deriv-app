import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
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
    const [has_close_icon, setHasCloseIcon] = React.useState(true);
    const won = profit > 0;
    const sign = won ? '+' : '';

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

    if (!is_sold)
        return (
            <AccumulatorsProfitLossText
                currency={currency}
                current_spot={current_spot}
                current_spot_time={current_spot_time}
                profit={profit}
            />
        );

    return (
        <FastMarker markerRef={onRef} className={classNames(className, won ? 'won' : 'lost')}>
            <span
                className={`${className}__spot-circle`}
                onMouseEnter={() => !is_tooltip_open && setIsTooltipOpen(true)}
                onMouseLeave={() => is_tooltip_open && !has_close_icon && setIsTooltipOpen(false)}
            />
            {is_tooltip_open && (
                <div className={classNames(`${className}__content`, `arrow-${opposite_arrow_position}`)}>
                    <Text size='xxs' className={`${className}__text`}>
                        {localize('Total profit/loss:')}
                    </Text>
                    <Text
                        size='xs'
                        className={`${className}__text`}
                        weight='bold'
                    >{`${sign}${profit} ${currency}`}</Text>
                    {has_close_icon && (
                        <Icon
                            className={`${className}__close-icon`}
                            icon='IcCloseLight'
                            onClick={() => {
                                setHasCloseIcon(false);
                                setIsTooltipOpen(false);
                            }}
                        />
                    )}
                </div>
            )}
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
