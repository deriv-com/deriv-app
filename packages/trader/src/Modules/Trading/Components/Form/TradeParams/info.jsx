import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Money, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const INFO_TYPES = {
    MULTIP: 'multipliers',
    ACC: 'accumulators',
    MAX_PAYOUT: 'max_payout',
};

const commission_tooltip_margin = 30;
const stop_out_tooltip_margin = 160;

const Info = ({
    amount = 0,
    className,
    commission = 0,
    commission_text_size,
    currency,
    has_stop_loss,
    is_accumulators_info,
    is_max_payout_info,
    is_multipliers_info,
    is_tooltip_relative,
    max_duration_text_size,
    max_duration_ticks,
    max_payout,
    max_payout_text_size,
    multiplier = 0,
    should_show_tooltip,
    stop_out = 0,
    stop_out_text_size,
    tick_size_barrier,
    tick_size_barrier_text_size,
}) => {
    const getRoundedTickSizeBarrier = () => {
        // business decision is to show 4 decimals including no more then 1 zero,
        // e.g. round 0.000409 to 0.0409%
        let rounded_tick_size_barrier;
        if (tick_size_barrier) {
            const decimal_zeros_count = -Math.floor(Math.log10(tick_size_barrier) + 1);
            if (decimal_zeros_count > 1) {
                rounded_tick_size_barrier = (
                    tick_size_barrier * Number(`1${'0'.repeat(decimal_zeros_count - 1)}`)
                ).toFixed(4);
            } else {
                rounded_tick_size_barrier = tick_size_barrier.toFixed(4);
            }
        }
        return rounded_tick_size_barrier;
    };

    let info_type = [];

    const getInfoContent = () => {
        let info_content;
        if (is_multipliers_info) {
            info_type = INFO_TYPES.MULTIP;
            info_content = [
                {
                    info_text: (
                        <Localize
                            i18n_default_text='Commission <0/>'
                            components={[<Money key={0} amount={commission} currency={currency} show_currency />]}
                        />
                    ),
                    margin: commission_tooltip_margin,
                    text_size: commission_text_size,
                    tooltip_message: (
                        <Localize
                            i18n_default_text='<0>{{commission_percentage}}%</0> of (<1/> * {{multiplier}})'
                            values={{
                                commission_percentage: Number((commission * 100) / (multiplier * amount)).toFixed(4),
                                multiplier,
                            }}
                            components={[
                                <Text size='xxs' weight='bold' key={0} />,
                                <Money key={1} amount={amount} currency={currency} />,
                            ]}
                        />
                    ),
                },
                {
                    info_text: (
                        <Localize
                            i18n_default_text='Stop out <0/>'
                            components={[<Money key={0} amount={stop_out} currency={currency} show_currency />]}
                        />
                    ),
                    margin: stop_out_tooltip_margin,
                    text_size: stop_out_text_size,
                    tooltip_message: (
                        <Localize
                            i18n_default_text='When your current loss equals or exceeds {{stop_out_percentage}}% of your stake, your contract will be closed at the nearest available asset price.'
                            values={{
                                stop_out_percentage: Math.floor(Math.abs(Number((stop_out * 100) / amount))),
                            }}
                        />
                    ),
                    is_hidden: has_stop_loss,
                },
            ];
        } else if (is_accumulators_info) {
            info_type = INFO_TYPES.ACC;
            info_content = [
                {
                    info_text: (
                        <Localize
                            i18n_default_text={'Distance from barriers <0>±{{tick_size_barrier}}%</0>'}
                            values={{ tick_size_barrier: getRoundedTickSizeBarrier() || '0.0000' }}
                            components={[<span key={0} />]}
                        />
                    ),
                    margin: commission_tooltip_margin,
                    text_size: tick_size_barrier_text_size,
                    tooltip_message: (
                        <Localize i18n_default_text='This is the distance of the barrier from the spot price.' />
                    ),
                },
                {
                    info_text: (
                        <Localize
                            i18n_default_text={'Maximum duration <0>{{max_duration_ticks}} ticks</0>'}
                            values={{ max_duration_ticks }}
                            components={[<span key={0} />]}
                        />
                    ),
                    margin: stop_out_tooltip_margin,
                    text_size: max_duration_text_size,
                    tooltip_message: (
                        <Localize
                            i18n_default_text='This contract will be closed automatically after {{max_duration_ticks}} ticks.'
                            values={{ max_duration_ticks }}
                        />
                    ),
                },
            ];
        } else if (is_max_payout_info) {
            info_type = INFO_TYPES.MAX_PAYOUT;
            info_content = [
                {
                    info_text: (
                        <Localize
                            i18n_default_text={'Maximum Payout<0>{{max_payout}} {{currency}}</0>'}
                            values={{ max_payout: max_payout?.toFixed(2), currency }}
                            components={[
                                <Text
                                    key={0}
                                    styles={{ marginLeft: '8px', borderBottom: 'none' }}
                                    size={max_payout_text_size || 'xxxs'}
                                />,
                            ]}
                        />
                    ),
                    margin: commission_tooltip_margin,
                    text_size: max_payout_text_size,
                },
            ];
        }

        return info_content.filter(_item => !_item.is_hidden);
    };

    const getText = ({ info_text, text_size }, index) => {
        return (
            <Text
                key={index}
                as='p'
                line_height='s'
                size={text_size || 'xxxs'}
                className={classNames({
                    [`${className}-tooltip-text`]: className,
                })}
            >
                {info_text}
            </Text>
        );
    };

    return (
        <div
            className={classNames(`${info_type}-trade-info`, className, {
                'mobile-widget__multiplier-trade-info--no-stop-out': has_stop_loss && is_multipliers_info,
            })}
        >
            {getInfoContent().map(({ tooltip_message, margin, ...rest }, index) => {
                return should_show_tooltip ? (
                    <Popover
                        key={index}
                        message={tooltip_message}
                        {...(is_tooltip_relative
                            ? { alignment: 'left', relative_render: true, margin }
                            : { alignment: 'top', zIndex: 9999 })}
                    >
                        {getText(rest, index)}
                    </Popover>
                ) : (
                    getText(rest, index)
                );
            })}
        </div>
    );
};

Info.propTypes = {
    amount: PropTypes.number,
    className: PropTypes.string,
    commission: PropTypes.number,
    commission_text_size: PropTypes.string,
    currency: PropTypes.string,
    has_stop_loss: PropTypes.bool,
    is_accumulators_info: PropTypes.bool,
    is_max_payout_info: PropTypes.bool,
    is_multipliers_info: PropTypes.bool,
    is_tooltip_relative: PropTypes.bool,
    max_duration_ticks: PropTypes.number,
    max_duration_text_size: PropTypes.string,
    max_payout: PropTypes.number,
    max_payout_text_size: PropTypes.string,
    multiplier: PropTypes.number,
    should_show_tooltip: PropTypes.bool,
    stop_out: PropTypes.number,
    stop_out_text_size: PropTypes.string,
    tick_size_barrier: PropTypes.number,
    tick_size_barrier_text_size: PropTypes.string,
};

export const MultipliersInfo = connect(({ modules }, props) => ({
    amount: props.amount ?? modules.trade.amount,
    commission: props.commission ?? modules.trade.commission,
    currency: modules.trade.currency,
    has_stop_loss: modules.trade.has_stop_loss,
    multiplier: modules.trade.multiplier,
    stop_out: props.stop_out ?? modules.trade.stop_out,
}))(Info);

export const AccumulatorsInfo = connect(({ modules }) => ({
    max_duration_ticks: modules.trade.max_duration_ticks,
    tick_size_barrier: modules.trade.tick_size_barrier,
}))(Info);

export const MaxPayoutInfo = connect(({ modules }) => ({
    currency: modules.trade.currency,
    max_payout: modules.trade.max_payout,
}))(Info);
