declare global {
    interface Window {
        opera?: string;
        MSStream?: {
            readonly type: string;
            msClose: () => void;
            msDetachStream: () => void;
        };
    }
}

export const systems = {
    mac: ['Mac68K', 'MacIntel', 'MacPPC'],
    linux: [
        'HP-UX',
        'Linux i686',
        'Linux amd64',
        'Linux i686 on x86_64',
        'Linux i686 X11',
        'Linux x86_64',
        'Linux x86_64 X11',
        'FreeBSD',
        'FreeBSD i386',
        'FreeBSD amd64',
        'X11',
    ],
    ios: ['iPhone', 'iPod', 'iPad', 'iPhone Simulator', 'iPod Simulator', 'iPad Simulator'],
    android: [
        'Android',
        'Linux armv7l', // Samsung galaxy s2 ~ s5, nexus 4/5
        'Linux armv8l',
        null,
    ],
    windows: ['Win16', 'Win32', 'Win64', 'WinCE'],
};

export const isDesktopOs = () => {
    const os = OSDetect();
    return !!['windows', 'mac', 'linux'].find(system => system === os);
};

export const isMobileOs = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const OSDetect = () => {
    // For testing purposes or more compatibility, if we set 'config.os'
    // inside our localStorage, we ignore fetching information from
    // navigator object and return what we have straight away.
    if (localStorage.getItem('config.os')) {
        return localStorage.getItem('config.os');
    }
    if (typeof navigator !== 'undefined' && navigator.platform) {
        return Object.keys(systems)
            .map(os => {
                if (systems[os as keyof typeof systems].some(platform => navigator.platform === platform)) {
                    return os;
                }
                return false;
            })
            .filter(os => os)[0];
    }

    return 'Unknown OS';
};

export const mobileOSDetect = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return 'Windows Phone';
    }

    if (/android/i.test(userAgent)) {
        return 'Android';
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'iOS';
    }

    return 'unknown';
};
