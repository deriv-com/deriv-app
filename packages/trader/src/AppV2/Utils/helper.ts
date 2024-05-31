import { TGetCardLables } from '@deriv/components';
import { formatDuration, getDiffDuration } from '@deriv/shared';

type TRemainingTimeProps = {
    end_time?: number;
    start_time: moment.Moment;
    format?: string;
    getCardLabels: TGetCardLables;
};

export const getRemainingTime = ({ end_time, format, getCardLabels, start_time }: TRemainingTimeProps) => {
    if (!end_time || start_time.unix() > +end_time) {
        return;
    }

    const { days, timestamp } = formatDuration(getDiffDuration(start_time.unix(), end_time), format);
    let remaining_time = timestamp;
    if (days > 0) {
        remaining_time = `${days} ${days > 1 ? getCardLabels().DAYS : getCardLabels().DAY} ${timestamp}`;
    }
    return remaining_time;
};
