/**
 * Gets the current pathname from the URL
 * @returns {string} The current route
 */
export const getCurrentRoute = (): string | undefined => {
    const segments = new URL(window.location.href).pathname.split('/');
    const endPath = segments.pop();
    return endPath;
};
