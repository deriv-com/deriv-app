import semver from 'semver';
import { UAParser } from 'ua-parser-js';

type TBrowsers =
    | 'Chrome'
    | 'Edge'
    | 'Firefox'
    | 'Opera'
    | 'Safari'
    | 'Opera Android'
    | 'Mobile Safari'
    // | 'Samsung Internet'
    | 'Android Browser';

type TBrowserVersions = { [k in TBrowsers]: string };

const browsers_minimum_required_version = {
    Chrome: '40.0.0',
    Edge: '17.0.0',
    Safari: '11.1.0',
    Firefox: '44.0.0',
    Opera: '27.0.0',
    'Opera Android': '27.0.0',
    'Mobile Safari': '11.3.0',
    // 'Samsung Internet': '4.0.0',
    'Android Browser': '40.0.0',
} as const;

const parser = new UAParser();

const user_browser = {
    name: parser.getBrowser().name || '',
    version: semver.coerce(parser.getBrowser().version || '1.0.0.')?.version || '1.0.0',
};

const isServiceWorkerSupported = () => {
    // eslint-disable-next-line no-console
    console.log('user_browser', user_browser);
    return (
        typeof browsers_minimum_required_version[user_browser.name as keyof TBrowserVersions] !== 'undefined' &&
        semver.gt(user_browser.version, browsers_minimum_required_version[user_browser.name as keyof TBrowserVersions])
    );
};

export default isServiceWorkerSupported;
