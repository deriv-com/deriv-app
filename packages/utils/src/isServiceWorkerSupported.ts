import semver from 'semver';
import { UAParser } from 'ua-parser-js';

const minimum_required_browsers_versions: Record<string, string> = {
    Chrome: '40.0.0',
    Edge: '17.0.0',
    Safari: '11.1.0',
    Firefox: '44.0.0',
    Opera: '27.0.0',
    'Opera Android': '27.0.0',
    'Mobile Safari': '11.3.0',
    'Android Browser': '40.0.0', // check if this is correct
    'Chrome WebView': '40.0.0',
    'Samsung Browser': '4.0.0',
    UCBrowser: '11.4.0',
};

/** Check if the browser supports service worker */
const isServiceWorkerSupported = () => {
    const parser = new UAParser();
    const user_browser_name = parser.getBrowser().name || '';
    const user_browser_version = semver.coerce(parser.getBrowser().version || '1.0.0.')?.version || '1.0.0';
    const minimum_required_browsers_version = minimum_required_browsers_versions[user_browser_name];

    // if the browser is in the list , check if the version is greater than the minimum required
    if (minimum_required_browsers_version) return semver.gt(user_browser_version, minimum_required_browsers_version);

    // if the browser is not in the list, it is not supported
    return false;
};

export default isServiceWorkerSupported;
