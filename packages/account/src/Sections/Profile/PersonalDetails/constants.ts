import { localize } from '@deriv/translations';

export const account_opening_reason_list = [
    { text: localize('Speculative'), value: 'Speculative' },
    { text: localize('Income Earning'), value: 'Income Earning' },
    { text: localize('Hedging'), value: 'Hedging' },
];

export const salutation_list = [
    { text: localize('Mr'), value: 'Mr' },
    { text: localize('Mrs'), value: 'Mrs' },
    { text: localize('Ms'), value: 'Ms' },
    { text: localize('Miss'), value: 'Miss' },
] as const;
