import React from 'react';
import moment from 'moment';

import { formatDuration, getDiffDuration } from '@deriv/shared';

import { TGetCardLables } from '../types';

type TRemainingTimeProps = {
    end_time?: number;
    start_time: moment.Moment;
    format?: string;
    getCardLabels: TGetCardLables;
};

const RemainingTime = ({ end_time, format, getCardLabels, start_time }: TRemainingTimeProps) => {
    if (!end_time || start_time.unix() > +end_time) {
        return <React.Fragment>{''}</React.Fragment>;
    }

    const { days, timestamp } = formatDuration(getDiffDuration(start_time.unix(), end_time), format);
    let remaining_time = timestamp;
    if (days > 0) {
        remaining_time = `${days} ${days > 1 ? getCardLabels().DAYS : getCardLabels().DAY} ${timestamp}`;
    }
    const is_zeroes = /^00:00$/.test(remaining_time);

    return <React.Fragment>{!is_zeroes && <div className='dc-remaining-time'>{remaining_time}</div>}</React.Fragment>;
};

export default RemainingTime;
