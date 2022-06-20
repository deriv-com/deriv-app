import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const AccumulatorsInfo = ({
    barriers_distance = 0,
    barriers_distance_text_size,
    className,
    max_duration = 0,
    max_duration_text_size,
}) => {
    const info_blocks = [
        {
            custom_size: barriers_distance_text_size,
            i18n_default_text: 'Distance from barriers <0>±{{barriers_distance}}%</0>',
            values: { barriers_distance: barriers_distance.toFixed(3) },
        },
        {
            custom_size: max_duration_text_size,
            i18n_default_text: 'Maximum duration ticks <0>{{max_duration}}</0>',
            values: { max_duration },
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
    barriers_distance_text_size: PropTypes.string,
    is_tooltip_relative: PropTypes.bool,
    should_show_tooltip: PropTypes.bool,
    max_duration_text_size: PropTypes.string,
};

export default connect(({ modules }, props) => ({
    barriers_distance: props.barriers_distance ?? modules.trade.barriers_distance,
    max_duration: props.max_duration ?? modules.trade.max_duration,
}))(AccumulatorsInfo);
