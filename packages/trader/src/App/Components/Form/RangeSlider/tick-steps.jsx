import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';
import { connect }  from 'Stores/connect';

const TickSteps = ({ max_value, min_value, value, onClick }) => {
    const arr_ticks = [...Array((max_value - min_value) + 1).keys()];
    return (
        <React.Fragment>
            {arr_ticks.map(idx =>
                <span
                    key={idx}
                    className={classNames('range-slider__ticks-step', {
                        'range-slider__ticks-step--active': (idx + parseInt(min_value)) === parseInt(value),
                        'range-slider__ticks-step--marked': (idx + parseInt(min_value)) < parseInt(value),
                    })}
                    onClick={(e) => onClick(e, idx + parseInt(min_value))}
                />
            )}
        </React.Fragment>
    );
};

TickSteps.propTypes = {
    max_value: PropTypes.string,
    min_value: PropTypes.string,
    onClick  : PropTypes.func,
    ticks    : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default connect(
    ({ modules }) => ({
        max_value: modules.trade.duration_min_max.tick.max,
        min_value: modules.trade.duration_min_max.tick.min,
    })
)(TickSteps);
