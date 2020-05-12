import { localize } from '@deriv/translations';

/* eslint-disable react/display-name, react/prop-types */
export const getLoginHistoryColumnsTemplate = () => [
    {
        title: localize('Date and time'),
        col_index: 'date',
    },
    {
        title: localize('Action'),
        col_index: 'action',
    },
    {
        title: localize('Browser'),
        col_index: 'browser',
    },
    {
        title: localize('IP'),
        col_index: 'ip',
    },
    {
        title: localize('Status'),
        col_index: 'status',
    },
];
/* eslint-enable react/display-name, react/prop-types */
