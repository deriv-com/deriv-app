export const isSafari = () => {
    return (
        /constructor/i.test(window.HTMLElement) ||
        (function (p) {
            return p.toString() === '[object SafariRemoteNotification]';
        })(!window.safari || (typeof safari !== 'undefined' && window.safari.pushNotification))
    );
};

export const detectSafariBrowser = () => {
    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iP(ad|od|hone)/i);
    const hasSafariInUa = !!ua.match(/Safari/i);
    const noOtherBrowsersInUa = !ua.match(/Chrome|CriOS|OPiOS|mercury|FxiOS|Firefox/i);
    let result = false;
    if (iOS) {
        //detecting Safari in IOS mobile browsers
        const webkit = !!ua.match(/WebKit/i);
        result = webkit && hasSafariInUa && noOtherBrowsersInUa;
    } else if (window.safari !== undefined) {
        //detecting Safari in Desktop Browsers
        result = true;
    } else {
        // detecting Safari in other platforms
        result = hasSafariInUa && noOtherBrowsersInUa;
    }
    return result;
};
