const userAgent = window.navigator.userAgent.toLowerCase();

const device = {
    ipad: () => {
        const iPadOS13Up = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
        return find('ipad') || iPadOS13Up;
    },
    android: () => !device.windows() && find('android'),
    androidTablet: () => device.android() && !find('mobile'),
    blackberry: () => find('blackberry') || find('bb10'),
    blackberryTablet: () => device.blackberry() && find('tablet'),
    windows: () => find('windows'),
    windowsPhone: () => device.windows() && find('phone'),
    windowsTablet: () => device.windows() && find('touch') && !device.windowsPhone(),
    fxos: () => (find('(mobile') || find('(tablet')) && find(' rv:'),
    fxosTablet: () => device.fxos() && find('tablet'),
    tablet: () =>
        device.ipad() ||
        device.androidTablet() ||
        device.blackberryTablet() ||
        device.windowsTablet() ||
        device.fxosTablet(),
};

const includes = (haystack: string, needle: string) => haystack.indexOf(needle) !== -1;

const find = (needle: string) => includes(userAgent, needle);

export default device;
