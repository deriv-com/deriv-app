const BinarySocket   = require('../../app/base/socket');
const isIndonesia    = require('../../app/common/country_base').isIndonesia;
const getElementById = require('../../_common/common_functions').getElementById;
const TabSelector    = require('../../_common/tab_selector');
const isBinaryApp    = require('../../config').isBinaryApp;

const os_list = [
    {
        name    : 'mac',
        url_test: /\.dmg$/,
    },
    {
        name    : 'windows',
        url_test: /\.exe$/,
    },
    // {
    //     name    : 'linux',
    //     url_test: /x86_64\.AppImage$/,
    // }
];

const Platforms = (() => {
    const onLoad = () => {
        BinarySocket.wait('website_status').then(() => {
            $('.desktop-app').setVisibility(isIndonesia() && !isBinaryApp());
        });
        TabSelector.onLoad();
        $.getJSON('https://api.github.com/repos/binary-com/binary-desktop-installers/releases/latest', (data = { assets: [] }) => {
            data.assets.some((asset) => {
                if (os_list.every(os => os.download_url)) {
                    return true;
                }
                os_list.forEach(os => {
                    if (!os.download_url && os.url_test.test(asset.browser_download_url)) {
                        os.download_url = asset.browser_download_url;
                    }
                });
                return false;
            });
            os_list.forEach(os => {
                const el_button = getElementById(`app_${os.name}`);
                el_button.setAttribute('href', os.download_url);
            });
        });
    };

    return {
        onLoad,
    };
})();

module.exports = Platforms;
