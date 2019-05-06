const Client       = require('../../../base/client');
const BinarySocket = require('../../../base/socket');
const Scroll       = require('../../../../_common/scroll');
const State        = require('../../../../_common/storage').State;

const TypesOfAccounts = (() => {
    const onLoad = () => {
        Scroll.goToHashSection();

        if (Client.isLoggedIn()) {
            BinarySocket.wait('landing_company').then(() => {
                const should_show_maltainvest_content = State.getResponse('landing_company.financial_company.shortcode') === 'maltainvest'; // for VRTC, MLT, or MF
                $('.hide-maltainvest').setVisibility(!should_show_maltainvest_content);
                $('.show-maltainvest').setVisibility(should_show_maltainvest_content);
                showContent();
            });
        } else {
            showContent();
        }
    };

    const showContent = () => {
        $('#loading_types').setVisibility(0);
        $('#content_types').setVisibility(1);
    };

    return {
        onLoad,
    };
})();

module.exports = TypesOfAccounts;
