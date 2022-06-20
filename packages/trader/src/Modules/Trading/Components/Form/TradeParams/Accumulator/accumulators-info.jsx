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
    const info_blocks = [
        {
            custom_size: tick_size_barrier_text_size,
            i18n_default_text: 'Distance from barriers <0>±{{tick_size_barrier}}%</0>',
            values: { tick_size_barrier: Math.round((tick_size_barrier + Number.EPSILON) * 1000) / 1000 },
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
