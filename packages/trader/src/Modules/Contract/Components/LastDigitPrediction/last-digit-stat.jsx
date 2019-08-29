import PropTypes  from 'prop-types';
import React      from 'react';

const LastDigitStat = ({ is_max, is_min, percentage }) => {
    const stroke_color = () => {
        if (is_max) {
            return '#4BB4B3';
        } else if (is_min) {
            return '#EC3F3F';
        }
        return '#1C5AE3';
    };
    // interpolate color opacity within 7.5 to 12.5 range
    let opacity = (percentage - 10) / 2.5;
    opacity = Math.min(Math.max(opacity, -1), +1);
    opacity = (opacity + 1) / 2 * 0.85 + 0.15;

    return (
        <div className='digits__pie-container'>
            <svg className='digits__pie-progress' width='120' height='120' viewBox='0 0 120 120'>
                <circle
                    cx='60'
                    cy='60'
                    r='54'
                    fill='none'
                    stroke='#E8EEFC'
                    strokeWidth='12'
                />
                {percentage &&
                <circle
                    className='progress__value'
                    cx='60'
                    cy='60'
                    r='54'
                    fill='none'
                    stroke={stroke_color()}
                    strokeOpacity={(is_max || is_min) ? 1 : opacity}
                    strokeWidth='12'
                    strokeDashoffset={(339.292 * (1 - (3.5 * percentage / 100)))}
                />
                }
            </svg>
        </div>
    );
};

LastDigitStat.propTypes = {
    is_max    : PropTypes.bool,
    is_min    : PropTypes.bool,
    percentage: PropTypes.number,
};

export default LastDigitStat;
