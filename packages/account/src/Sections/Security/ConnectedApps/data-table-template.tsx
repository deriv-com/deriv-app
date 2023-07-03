/* eslint-disable react/display-name */
import React from 'react';
import { toMoment } from '@deriv/shared';
import { Button, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

type Column = {
    title: string;
    col_index: 'name' | 'scopes' | 'last_used' | 'app_id';
    renderCellContent: React.FC<{ cell_value: string & number & string[] }>;
};

type TGetConnectedAppsColumnsTemplate = {
    handleToggleModal: (app_id: number | null) => void;
};

type Permissions = {
    [key: string]: string;
};

const GetConnectedAppsColumnsTemplate = (
    handleToggleModal: TGetConnectedAppsColumnsTemplate['handleToggleModal']
): Column[] => [
    {
        title: localize('Name'),
        col_index: 'name',
        renderCellContent: ({ cell_value }) => {
            return (
                <Text size='xs' className='name__content'>
                    {cell_value}
                </Text>
            );
        },
    },
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

const PrepareConnectedAppsAction = (
    app_id: number,
    handleToggleModal: TGetConnectedAppsColumnsTemplate['handleToggleModal']
) => {
    return (
        <Button className='revoke_access' small secondary onClick={() => handleToggleModal(app_id)}>
            {localize('Revoke access')}
        </Button>
    );
};

const PrepareConnectedAppsLastLogin = (last_used: number) => (
    <Text as='p' size='xs' className='last_used_content'>
        {toMoment(last_used).format('YYYY-MM-DD HH:mm:ss')}
    </Text>
);

const generatePermissions = (): Permissions => ({
    read: localize('Read'),
    trade: localize('Trade'),
    trading_information: localize('Trading information'),
    payments: localize('Payments'),
    admin: localize('Admin'),
});

const PrepareConnectedAppsScopes = (permissions_list: string[]) => {
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

export default GetConnectedAppsColumnsTemplate;
