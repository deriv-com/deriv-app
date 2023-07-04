import semver from 'semver';
import { UAParser } from 'ua-parser-js';

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

const isServiceWorkerSupported = () => {
    const parser = new UAParser();

    const user_browser = {
        name: parser.getBrowser().name || '',
        version: semver.coerce(parser.getBrowser().version || '1.0.0.')?.version || '1.0.0',
    };

    return (
        typeof browsers_minimum_required_version[
            user_browser.name as keyof typeof browsers_minimum_required_version
        ] !== 'undefined' &&
        semver.gt(
            user_browser.version,
            browsers_minimum_required_version[user_browser.name as keyof typeof browsers_minimum_required_version]
        )
    );
};

export default isServiceWorkerSupported;
