import { localize } from 'Components/i18next';

export const order_list = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
};

export const time_list = [
    {
        text: localize('1 hour'),
        value: 3600,
    },
    {
        text: localize('45 minutes'),
        value: 2700,
    },
    {
        text: localize('30 minutes'),
        value: 1800,
    },
    {
        text: localize('15 minutes'),
        value: 900,
    },
];
