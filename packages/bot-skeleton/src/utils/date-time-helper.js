import { localize } from '@deriv/translations';

export const timeSince = timestamp => {
    const now = new Date();
    const secondPast = (now.getTime() - timestamp) / 1000;

    if (secondPast < 60) {
        return localize('{{secondPast}}s ago', { secondPast: parseInt(secondPast) });
    }
    if (secondPast < 3600) {
        return localize('{{minutePast}}m ago', { minutePast: parseInt(secondPast / 60) });
    }
    if (secondPast < 86400) {
        return localize('{{hourPast}}h ago', { hourPast: parseInt(secondPast / 3600) });
    }
    if (secondPast <= 432000) {
        return localize('{{days}} days ago', { days: parseInt(secondPast / 86400) });
    }

    const timestampDate = new Date(timestamp);
    const day = timestampDate.getDate();
    const month = timestampDate
        .toDateString()
        .match(/ [a-zA-Z]*/)[0]
        .replace(' ', '');
    const year = `${timestampDate.getFullYear() === now.getFullYear() ? '' : ' '}${timestampDate.getFullYear()}`;
    return `${day} ${month}${year}`;
};
