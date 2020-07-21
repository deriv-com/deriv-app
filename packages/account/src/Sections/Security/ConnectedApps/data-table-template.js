import React from 'react';
import { toMoment } from '@deriv/shared';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';

const GetConnectedAppsColumnsTemplate = (handleToggleModal) => [
    { title: localize('Name'), col_index: 'name' },
    {
        title: localize('Permission'),
        col_index: 'scopes',
        renderCellContent: ({ cell_value }) => {
            return PrepareConnectedAppsScopes(cell_value);
        },
    },
    {
        title: localize('Last login'),
        col_index: 'last_used',
        renderCellContent: ({ cell_value }) => PrepareConnectedAppsLastLogin(cell_value),
    },
    {
        title: localize('Action'),
        col_index: 'app_id',
        renderCellContent: ({ cell_value }) => PrepareConnectedAppsAction(cell_value, handleToggleModal),
    },
];

const PrepareConnectedAppsAction = (app_id, handleToggleModal) => {
    return (
        <Button className='revoke_access' small secondary onClick={() => handleToggleModal(app_id)}>
            {localize('Revoke access')}
        </Button>
    );
};

const PrepareConnectedAppsLastLogin = (last_used) => (
    <p className='last_used_content'>{toMoment(last_used).format('YYYY-MM-DD HH:mm:ss')}</p>
);

const scope_list = {
    read: 'Read',
    trade: 'Trade',
    trading_information: 'Trading information',
    payments: 'Payments',
    admin: 'Admin',
};

const generatePermission = (scope) => {
    return scope_list[scope];
};
const PrepareConnectedAppsScopes = (permissions_list) => {
    const is_trading_information = permissions_list.includes('trading_information');
    let oauth_apps_list = [];
    if (is_trading_information) {
        oauth_apps_list = permissions_list.filter((permission) => permission !== 'trading_information');
        oauth_apps_list.push('trading_information');
    } else {
        oauth_apps_list = permissions_list;
    }
    const sorted_app_list = [];
    oauth_apps_list.forEach((permission, index) => {
        if (permissions_list.length - 1 !== index) {
            sorted_app_list.push(`${generatePermission(permission)}, `);
        } else {
            sorted_app_list.push(generatePermission(permission));
        }
    });
    return <div>{sorted_app_list}</div>;
};

export default GetConnectedAppsColumnsTemplate;
