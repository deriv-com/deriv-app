import { diffInMonths, epochToMoment, toMoment } from '@deriv/shared';

export const isPeriodDisabledTo = (date, from) => {
    return date + 1 <= from || date > toMoment().endOf('day').unix();
};

export const isPeriodDisabledFrom = (date, to) => {
    return date - 1 >= to;
};

/**
 * Only allow previous months to be available to navigate. Disable other periods
 *
 * @param date
 * @param range
 * @param left_pane_date
 * @returns {boolean}
 */
export const validateFromArrows = (date, range, left_pane_date) => {
    return range === 'year' || diffInMonths(epochToMoment(left_pane_date), date) !== -1;
};

/**
 * Validate values to be date_from < date_to
 */
export const shouldDisableDate = (date, isPeriodDisabled) => {
    return isPeriodDisabled(date.unix());
};

/**
 * Only allow next month to be available to navigate (unless next month is in the future).
 * Disable other periods
 *
 * @param date
 * @param range
 * @param right_pane_date
 * @returns {boolean}
 */
export const validateToArrows = (date, range, right_pane_date) => {
    if (range === 'year') return true; // disallow year arrows
    const r_date = epochToMoment(right_pane_date).startOf('month');
    if (diffInMonths(toMoment().startOf('month'), r_date) === 0) return true; // future months are disallowed
    return diffInMonths(r_date, date) !== 1;
};
