import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const AccumulatorsInfo = ({
    className,
    max_duration_ticks,
    max_duration_text_size,
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

    const info_blocks = [
        {
            custom_size: tick_size_barrier_text_size,
            i18n_default_text: 'Distance from barriers <0>±{{tick_size_barrier}}%</0>',
            values: { tick_size_barrier: getRoundedTickSizeBarrier() || '0.0000' },
        },
        {
            custom_size: max_duration_text_size,
            i18n_default_text: 'Maximum duration ticks <0>{{max_duration_ticks}}</0>',
            values: { max_duration_ticks },
        },
    ];

    return (
        <div className={classNames('accumulators-trade-info', className)}>
            {info_blocks.map((el, index) => (
                <Text
                    key={index}
                    as='p'
                    line_height='s'
                    size={el.custom_size || 'xxxs'}
                    className={classNames({
                        [`${className}-tooltip-text`]: className,
                    })}
                >
                    <Localize
                        i18n_default_text={el.i18n_default_text}
                        values={el.values}
                        components={[<span key={0} />]}
                    />
                </Text>
            ))}
        </div>
    );
};

AccumulatorsInfo.propTypes = {
    className: PropTypes.string,
    max_duration_ticks: PropTypes.number,
    max_duration_text_size: PropTypes.string,
    tick_size_barrier: PropTypes.number,
    tick_size_barrier_text_size: PropTypes.string,
};

export default connect(({ modules }) => ({
    max_duration_ticks: modules.trade.max_duration_ticks,
    tick_size_barrier: modules.trade.tick_size_barrier,
}))(AccumulatorsInfo);
