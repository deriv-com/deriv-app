import React from 'react';
import { Localize, localize } from '@deriv/translations';
import { toMoment } from '@deriv/shared';
import { Button, Text } from '@deriv/components';

type Permissions = {
    [key: string]: string;
};

export type TDataTableTemplateProps = {
    handleToggleModal: (app_id: number | null) => void;
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

export const getConnectedAppsLastLogin = (last_used: number) => (
    <Text as='p' size='xs' className='last_used_content'>
        {toMoment(last_used).format('YYYY-MM-DD HH:mm:ss')}
    </Text>
);

export const getConnectedAppsAction = (
    app_id: number,
    handleToggleModal: TDataTableTemplateProps['handleToggleModal']
) => (
    <Button className='revoke_access' small secondary onClick={() => handleToggleModal(app_id)}>
        <Localize i18n_default_text='Revoke access' />
    </Button>
);
