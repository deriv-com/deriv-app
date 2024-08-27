import { Localize, localize } from '@deriv-com/translations';

export const getConnectedAppsColumnNames = () => [
    <Localize key='name' i18n_default_text='Name' />,
    <Localize key='permission' i18n_default_text='Permission' />,
    <Localize key='last_login' i18n_default_text='Last login' />,
    <Localize key='action' i18n_default_text='Action' />,
];

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

export const getConnectedAppsScopes = (permission_list: string[] = []) =>
    permission_list.map(permission => generatePermissions()[permission]).join(', ');
