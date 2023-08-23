import { localize } from 'Components/i18next';

export const order_list = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
};

export const order_time_info_message = localize('Orders will expire if they aren’t completed within this time.');

//TODO: to be finalized.
export const time_list = [
    {
        text: localize('1 hour'),
        value: '60',
    },
    {
        text: localize('1.5 hours'),
        value: '90',
    },
    {
        text: localize('2 hours'),
        value: '120',
    },
    {
        text: localize('45 minutes'),
        value: '45',
    },
    {
        text: localize('30 minutes'),
        value: '30',
    },
    {
        text: localize('15 minutes'),
        value: '15',
    },
];
