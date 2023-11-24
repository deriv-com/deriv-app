import React from 'react';
import { localize } from '@deriv/translations';

type Permissions = {
    [key: string]: string;
};

export const generatePermissions = (): Permissions => ({
    read: localize('Read'),
    trade: localize('Trade'),
    trading_information: localize('Trading information'),
    payments: localize('Payments'),
    admin: localize('Admin'),
});

export const getConnectedAppsScopes = (permissions_list: string[]) => {
    const is_trading_information = permissions_list.includes('trading_information');
    let oauth_apps_list = [];
    if (is_trading_information) {
        oauth_apps_list = permissions_list.filter(permission => permission !== 'trading_information');
        oauth_apps_list.push('trading_information');
    } else {
        oauth_apps_list = permissions_list;
    }
    const sorted_app_list: string[] = [];
    oauth_apps_list.forEach((permission, index) => {
        if (permissions_list.length - 1 !== index) {
            sorted_app_list.push(`${generatePermissions()[permission]}, `);
        } else {
            sorted_app_list.push(generatePermissions()[permission]);
        }
    });
    return <div>{sorted_app_list}</div>;
};
