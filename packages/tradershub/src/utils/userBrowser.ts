const getUserBrowser = () => {
    // We can't rely only on navigator.userAgent.index, the verification order is also important
    if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) !== -1) {
        return 'Opera';
    } else if (navigator.userAgent.indexOf('Edg') !== -1) {
        return 'Edge';
    } else if (navigator.userAgent.indexOf('Chrome') !== -1) {
        return 'Chrome';
    } else if (navigator.userAgent.indexOf('Safari') !== -1) {
        return 'Safari';
    } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
        return 'Firefox';
    }
    return 'unknown';
};

export const isSafariBrowser = () => getUserBrowser() === 'Safari';
