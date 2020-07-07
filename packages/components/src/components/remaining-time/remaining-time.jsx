import PropTypes from 'prop-types';
import React from 'react';
import { formatDuration, getDiffDuration } from '@deriv/shared/utils/date';

const RemainingTime = ({ end_time = null, start_time, format, card_labels }) => {
    if (!+end_time || start_time.unix() > +end_time) {
        return '';
    }

    const { days, timestamp } = formatDuration(getDiffDuration(start_time.unix(), end_time), format);
    let remaining_time = timestamp;
    if (days > 0) {
        remaining_time = `${days} ${days > 1 ? card_labels.DAYS : card_labels.DAY} ${timestamp}`;
    }
    const is_zeroes = /^00:00$/.test(remaining_time);

    return !is_zeroes && <div className='remaining-time'>{remaining_time}</div>;
};

RemainingTime.propTypes = {
    end_time: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    start_time: PropTypes.object,
};

export default RemainingTime;
