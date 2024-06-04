import moment, { Duration } from 'moment';
import { epochToMoment, toMoment } from './time';

/**
 * return moment duration between two dates
 * @param  {Number} epoch start time
 * @param  {Number} epoch end time
 * @return {moment.duration} moment duration between start time and end time
 */
export const getDiffDuration = (startTime: number, endTime: number): Duration =>
    moment.duration(moment.unix(endTime).diff(moment.unix(startTime)));

const getStatusLabel = (diff: Duration) => {
    if (diff.years()) return 'Seen more than 6 months ago';

    if (diff.months()) {
        if (diff.months() > 6) {
            return 'Seen more than 6 months ago';
        }
        if (diff.months() === 1) {
            return `Seen ${diff.months()} month ago`;
        }
        return `Seen ${diff.months()} months ago`;
    }
    if (diff.days()) {
        if (diff.days() === 1) {
            return `Seen ${diff.days()} day ago`;
        }
        return `Seen ${diff.days()} days ago`;
    }
    if (diff.hours()) {
        if (diff.hours() === 1) {
            return `Seen ${diff.hours()} hour ago`;
        }
        return `Seen ${diff.hours()} hours ago`;
    }
    if (diff.minutes()) {
        if (diff.minutes() === 1) {
            return `Seen ${diff.minutes()} minute ago`;
        }
        return `Seen ${diff.minutes()} minutes ago`;
    }
    return 'Online';
};

const getTimeDifference = (lastSeenOnline: number) => {
    const startTime = epochToMoment(lastSeenOnline).unix();
    const endTime = toMoment().unix();
    return getDiffDuration(startTime, endTime);
};

/**
 * Function to generate the status label for the user based on the given online status and last online time.
 *
 * @param {boolean} isOnline - The online status of the user
 * @param {number} lastOnlineTime - The last online time in epoch
 * @returns {string} The status label to be shown.
 */
export const getLastOnlineLabel = (isOnline: boolean, lastOnlineTime?: number): string => {
    if (!isOnline) {
        if (lastOnlineTime) {
            const diff = getTimeDifference(lastOnlineTime);
            return getStatusLabel(diff);
        }
        return 'Seen more than 6 months ago';
    }
    return 'Online';
};
