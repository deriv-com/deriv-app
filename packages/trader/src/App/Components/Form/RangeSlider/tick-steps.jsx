import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';
import { connect }  from 'Stores/connect';

const TickSteps = ({ max_value, min_value, hover_value, value, onClick, onMouseEnter, onMouseLeave }) => {
    const arr_ticks = [...Array((max_value - min_value) + 1).keys()];

    const isActive = (idx) => (idx + parseInt(min_value)) === parseInt(value);
    const isMarked = (idx) => (idx + parseInt(min_value)) < parseInt(value);
    const isMarkedOnHover = (idx) => (isMarked(idx)) ? false : (idx + parseInt(min_value)) <= parseInt(hover_value);

    return (
        <React.Fragment>
            {arr_ticks.map(idx =>
                <span
                    key={idx}
                    className={classNames('range-slider__ticks-step', {
                        'range-slider__ticks-step--active'      : isActive(idx),
                        'range-slider__ticks-step--marked'      : isMarked(idx),
                        'range-slider__ticks-step--marked-hover': isMarkedOnHover(idx),
                    })}
                    onClick={(e) => onClick(e, idx + parseInt(min_value))}
                    onMouseEnter={(e) => onMouseEnter(e, idx + parseInt(min_value))}
                    onMouseLeave={onMouseLeave}
                />
            )}
        </React.Fragment>
    );
};

TickSteps.propTypes = {
    hover_value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
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
