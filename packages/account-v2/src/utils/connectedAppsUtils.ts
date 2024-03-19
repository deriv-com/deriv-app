export const getFormattedAppScopes = (scopes: string[] | undefined) =>
    scopes?.map(scope => scope[0].toUpperCase() + scope.substring(1).toLowerCase()).join(', ');
