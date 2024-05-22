export const getAvailablePlatforms = (): Array<'options' | 'multipliers' | 'cfds'> => {
    const platforms = localStorage.getItem('th_platforms');
    return platforms ? JSON.parse(platforms) : [];
};
