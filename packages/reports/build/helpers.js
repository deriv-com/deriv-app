/**
 * @param {Buffer} content
 * @param {string} path
 * @param {string|RegExp} base
 * */
const transformContentUrlBase = (content, path, base) => {
    return content.toString().replace(/{root_url}|{start_url_base}/g, base);
};

/**
 * @returns {string} Chrome browser string
 * */
const openChromeBasedOnPlatform = platform => {
    switch (platform) {
        case 'win32': {
            return 'chrome';
        }
        case 'linux': {
            return 'google-chrome';
        }
        case 'darwin': {
            return 'Google Chrome';
        }
        default: {
            return 'Google Chrome';
        }
    }
};

module.exports = {
    transformContentUrlBase,
    openChromeBasedOnPlatform,
};
