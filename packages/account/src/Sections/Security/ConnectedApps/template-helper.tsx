import React from 'react';
import { Localize, localize } from '@deriv/translations';

export const CONNECTED_APPS_COLUMN_NAMES = [
    <Localize key='name' i18n_default_text='Name' />,
    <Localize key='permission' i18n_default_text='Permission' />,
    <Localize key='last_login' i18n_default_text='Last login' />,
    <Localize key='action' i18n_default_text='Action' />,
] as const;

type Permissions = {
    [key: string]: string;
};

const generatePermissions = (): Permissions => ({
    read: localize('Read'),
    trade: localize('Trade'),
    trading_information: localize('Trading information'),
    payments: localize('Payments'),
    admin: localize('Admin'),
});

export const getConnectedAppsScopes = (permissions_list: string[] = []) => {
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
        const separator = index === permissions_list.length - 1 ? '' : ', ';
        sorted_app_list.push(`${generatePermissions()[permission]}${separator}`);
    });
    return sorted_app_list;
};
