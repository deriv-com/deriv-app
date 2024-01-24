import { toMoment } from '@deriv/utils';

/**
 * return the number of days since the date specified
 * @param  {String} date   the date to calculate number of days since
 * @return {Number} an integer of the number of days
 */
export const daysSince = (date: string) => {
    const diff = toMoment().startOf('day').diff(toMoment(date).startOf('day'), 'days');
    return !date ? '' : diff;
};
