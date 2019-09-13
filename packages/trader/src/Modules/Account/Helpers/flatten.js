export const flatten = (routes) => routes.map(item => item.subroutes).flat();
