import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { FastMarker } from 'Modules/SmartChart';

const AccumulatorsProfitLossTooltip = ({ currency, exit_tick = 0, exit_tick_time = 0, profit }) => {
    // TODO:
    // - implement different coloring of elements for won/lost contract
    // - add top, bottom arrows & dependency to select one of 4 arrows
    // - show AccumulatorsProfitLossTooltip for all closed contracts on the chart, not only the last one
    const [is_tooltip_open, setIsTooltipOpen] = React.useState(true);
    const className = 'sc-accumulators-profit-loss-tooltip';
    const won = profit > 0;
    const sign = won ? '+' : '';
    const onRef = ref => {
        if (ref) {
            // NOTE: null price (exit_tick) means vertical line.
            if (!exit_tick) {
                ref.div.style.height = `calc(100% - 24px)`;
                ref.div.style.zIndex = '-1';
            }
            ref.setPosition({
                epoch: +exit_tick_time,
                price: +exit_tick,
            });
        }
    };

    return (
        <FastMarker markerRef={onRef} className={className}>
            <span
                className={`${className}__spot-circle ${won ? 'won' : 'lost'}`}
                onMouseEnter={() => !is_tooltip_open && setIsTooltipOpen(true)}
            />
            {is_tooltip_open && (
                <div className={`${className}__content arrow-left`} data-tooltip-pos='right'>
                    <Text size='xxs' className={`${className}__text`}>
                        {localize('Total profit/loss:')}
                    </Text>
                    <Text
                        size='xs'
                        className={`${className}__text`}
                        weight='bold'
                    >{`${sign}${profit} ${currency}`}</Text>
                    <Icon
                        className={`${className}__close-icon`}
                        icon='IcCloseLight'
                        onClick={() => setIsTooltipOpen(false)}
                    />
                </div>
            )}
        </FastMarker>
    );
};

AccumulatorsProfitLossTooltip.propTypes = {
    currency: PropTypes.string,
    exit_tick: PropTypes.number,
    exit_tick_time: PropTypes.number,
    profit: PropTypes.number,
};

export default AccumulatorsProfitLossTooltip;
