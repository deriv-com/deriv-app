type TConnectedAppsHeader = {
    [key: string]: string;
};

export const connectedAppsHeader: TConnectedAppsHeader = {
    action: 'Action',
    lastLogin: 'Last Login',
    name: 'Name',
    permission: 'Permission',
};

export const connectedAppsHeaderOrder = ['name', 'permission', 'lastLogin', 'action'];

export const getConnectedAppsScopes = (scopes: string[] | undefined) =>
    scopes?.map((scope: string) => scope[0].toUpperCase() + scope.substring(1).toLowerCase()).join(', ');
