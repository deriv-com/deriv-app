export const COUNTERPARTIES_DROPDOWN_LIST = Object.freeze([
    { text: 'All', value: 'all' },
    { text: 'Blocked', value: 'blocked' },
]);

export const RATE_TYPE = Object.freeze({
    FIXED: 'fixed',
    FLOAT: 'float',
});

export const AD_ACTION = {
    ACTIVATE: 'activate',
    CREATE: 'create',
    DEACTIVATE: 'deactivate',
    DELETE: 'delete',
    EDIT: 'edit',
    SHARE: 'share',
} as const;

export const ADVERT_TYPE = Object.freeze({
    BUY: 'Buy',
    SELL: 'Sell',
});

export const SORT_BY_LIST = Object.freeze([
    { text: 'Exchange rate', value: 'rate' },
    { text: 'User rating', value: 'rating' },
]);

export const AD_CONDITION_TYPES = {
    COMPLETION_RATE: 'completionRates',
    JOINING_DATE: 'joiningDate',
    PREFERRED_COUNTRIES: 'preferredCountries',
} as const;

export const AD_CONDITION_CONTENT: Record<
    string,
    { description: string; options?: { label: string; value: number }[]; title: string }
> = {
    completionRates: {
        description:
            'We’ll only show your ad to people with a completion rate higher than your selection. \n\nThe completion rate is the percentage of successful orders.',
        options: [
            { label: '50%', value: 50 },
            { label: '70%', value: 70 },
            { label: '90%', value: 90 },
        ],
        title: 'Completion rate of more than',
    },
    joiningDate: {
        description:
            'We’ll only show your ad to people who’ve been using Deriv P2P for longer than the time you choose.',
        options: [
            { label: '15 days', value: 15 },
            { label: '30 days', value: 30 },
            { label: '60 days', value: 60 },
        ],
        title: 'Joined more than',
    },
    preferredCountries: {
        description: 'We’ll only show your ad to people in the countries you choose.',
        title: 'Preferred countries',
    },
} as const;
