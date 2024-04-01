import dayjs from 'dayjs';

export const getFormattedAppScopes = (scopes: string[] | undefined) =>
    scopes?.map(scope => scope[0].toUpperCase() + scope.substring(1).toLowerCase()).join(', ');

export const formatDate = (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss');
