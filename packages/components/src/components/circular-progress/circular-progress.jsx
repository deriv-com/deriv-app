import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const CircularProgress = ({ className, is_clockwise, progress, radius, stroke }) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    return (
        <div className={classNames('dc-circular-progress', className)}>
            <svg height={radius * 2} width={radius * 2}>
                <circle
                    className={classNames({
                        clockwise: is_clockwise,
                    })}
                    cx={radius}
                    cy={radius}
                    fill='transparent'
                    r={normalizedRadius}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeWidth={stroke}
                    style={{ strokeDashoffset }}
                />
            </svg>
        </div>
    );
};

CircularProgress.defaultProps = {
    is_clockwise: false,
    progress: 0,
    radius: 44,
    stroke: 5,
};

export default CircularProgress;

CircularProgress.propTypes = {
    className: PropTypes.string,
    is_clockwise: PropTypes.bool,
    progress: PropTypes.number,
    radius: PropTypes.number,
    stroke: PropTypes.number,
};
