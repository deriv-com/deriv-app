type TConnectedAppsHeader = {
    [key: string]: string;
};

export const CONNECTED_APPS_HEADER: TConnectedAppsHeader = {
    action: 'Action',
    lastLogin: 'Last Login',
    name: 'Name',
    permission: 'Permission',
};

export const CONNECTED_APPS_HEADER_ORDER = ['name', 'permission', 'lastLogin', 'action'];
