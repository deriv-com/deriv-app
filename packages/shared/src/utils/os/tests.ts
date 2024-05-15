const device: Record<string, () => boolean> = {};

// The client user agent string.
// Lowercase, so we can use the more efficient indexOf(), instead of Regex
const userAgent = window.navigator.userAgent.toLowerCase();

// Main functions

device.ios = function () {
    return device.iphone() || device.ipod() || device.ipad();
};

device.iphone = function () {
    return !device.windows() && find('iphone');
};

device.ipod = function () {
    return find('ipod');
};

device.ipad = function () {
    const iPadOS13Up = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    return find('ipad') || iPadOS13Up;
};

device.android = function () {
    return !device.windows() && find('android');
};

device.androidTablet = function () {
    return device.android() && !find('mobile');
};

device.blackberry = function () {
    return find('blackberry') || find('bb10');
};

device.blackberryTablet = function () {
    return device.blackberry() && find('tablet');
};

device.windows = function () {
    return find('windows');
};

device.windowsPhone = function () {
    return device.windows() && find('phone');
};

device.windowsTablet = function () {
    return device.windows() && find('touch') && !device.windowsPhone();
};

device.fxos = function () {
    return (find('(mobile') || find('(tablet')) && find(' rv:');
};

device.fxosTablet = function () {
    return device.fxos() && find('tablet');
};

device.tablet = function () {
    return (
        device.ipad() ||
        device.androidTablet() ||
        device.blackberryTablet() ||
        device.windowsTablet() ||
        device.fxosTablet()
    );
};

function includes(haystack: string, needle: string) {
    return haystack.indexOf(needle) !== -1;
}

function find(needle: string) {
    return includes(userAgent, needle);
}

export default device;
