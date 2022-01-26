import React from 'react';
import { formatDuration, getDiffDuration } from '@deriv/shared';

type RemainingTimeProps = {
    end_time: unknown | number | string;
    start_time: unknown;
};

const RemainingTime = ({ end_time = null, format, getCardLabels, start_time }: RemainingTimeProps) => {
    if (!+end_time || start_time.unix() > +end_time) {
        return '';
    }

    const { days, timestamp } = formatDuration(getDiffDuration(start_time.unix(), end_time), format);
    let remaining_time = timestamp;
    if (days > 0) {
        remaining_time = `${days} ${days > 1 ? getCardLabels().DAYS : getCardLabels().DAY} ${timestamp}`;
    }
    const is_zeroes = /^00:00$/.test(remaining_time);

    return !is_zeroes && <div className='dc-remaining-time'>{remaining_time}</div>;
};

export default RemainingTime;
