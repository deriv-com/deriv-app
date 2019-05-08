const BinarySocket     = require('../../../base/socket');
const Client           = require('../../../base/client');
const getElementById   = require('../../../../_common/common_functions').getElementById;
const localize         = require('../../../../_common/localize').localize;
const Url              = require('../../../../_common/url');
const createElement    = require('../../../../_common/utility').createElement;
const showLoadingImage = require('../../../../_common/utility').showLoadingImage;

const WelcomePage = (() => {
    const onLoad = () => {
        BinarySocket.wait('authorize', 'landing_company', 'get_settings').then(() => {
            const el_welcome_container = getElementById('welcome_container');
            if (Client.hasAccountType('real')) {
                window.location.href = Client.defaultRedirectUrl();
                showLoadingImage(el_welcome_container, 'dark');
            }

            const upgrade_info = Client.getUpgradeInfo();
            const el_upgrade_title = getElementById('upgrade_title');
            el_upgrade_title.html(upgrade_info.type === 'financial' ? localize('Financial Account') : localize('Real Account'));
            el_welcome_container.setVisibility(1);

            if (upgrade_info.can_upgrade) {
                const upgrade_btn = getElementById('upgrade_btn');
                if (upgrade_btn) {
                    upgrade_btn.html(createElement('span', { text: localize('Upgrade now') })).setAttribute('href', Url.urlFor(upgrade_info.upgrade_link));
                    upgrade_btn.classList.remove('button-disabled');
                }
            }
        });
    };

    return {
        onLoad,
    };
})();

module.exports = WelcomePage;
