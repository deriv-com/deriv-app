import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const TickSteps = ({
    hover_value,
    max_value,
    min_value,
    onClick,
    onMouseEnter,
    onMouseLeave,
    value,
}) => {
    const arr_ticks = [...Array((max_value - min_value) + 1).keys()];

    const isActive = (idx) => (idx + min_value) === value;
    const isMarked = (idx) => (idx + min_value) < value;
    const isMarkedOnHover = (idx) => (isMarked(idx)) ? false : (idx + min_value) <= hover_value;

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
                    onClick={() => onClick(idx + min_value)}
                    onMouseEnter={() => onMouseEnter(idx + min_value)}
                    onMouseLeave={onMouseLeave}
                />
            )}
        </React.Fragment>
    );
};

TickSteps.propTypes = {
    hover_value : PropTypes.number,
    max_value   : PropTypes.number,
    min_value   : PropTypes.number,
    onClick     : PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    value       : PropTypes.number,
};

export default TickSteps;
