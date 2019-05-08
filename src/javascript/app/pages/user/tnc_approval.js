const BinaryPjax   = require('../../base/binary_pjax');
const Client       = require('../../base/client');
const Header       = require('../../base/header');
const BinarySocket = require('../../base/socket');
const State        = require('../../../_common/storage').State;
const urlFor       = require('../../../_common/url').urlFor;
const template     = require('../../../_common/utility').template;

const TNCApproval = (() => {
    const onLoad = () => {
        requiresTNCApproval($('#btn_accept'), display, null, true);
    };

    const display = () => {
        const landing_company = State.getResponse('authorize.landing_company_fullname');
        if (!landing_company) return;

        const $container = $('#tnc_container');
        const $tnc_msg   = $container.find('#tnc_message');
        $tnc_msg.html(template($tnc_msg.html(), [
            landing_company,
            urlFor('terms-and-conditions'),
        ]));
        $container.find('#tnc_loading').remove();
        $container.find('#tnc_approval').setVisibility(1);
    };

    const requiresTNCApproval = ($btn, funcDisplay, onSuccess, redirect_anyway) => {
        BinarySocket.wait('website_status', 'get_settings').then(() => {
            if (!Client.shouldAcceptTnc()) {
                redirectBack(redirect_anyway);
                return;
            }

            funcDisplay();

            $btn.click((e) => {
                e.preventDefault();
                e.stopPropagation();
                BinarySocket.send({ tnc_approval: '1' }, { forced: true }).then((response) => {
                    if (response.error) {
                        $('#err_message').html(response.error.message).setVisibility(1);
                    } else {
                        BinarySocket.send({ get_settings: 1 }, { forced: true }).then(() => {
                            Header.displayAccountStatus();
                        });
                        redirectBack(redirect_anyway);
                        if (typeof onSuccess === 'function') {
                            onSuccess();
                        }
                    }
                });
            });
        });
    };

    const redirectBack = (redirect_anyway) => {
        if (redirect_anyway) {
            setTimeout(() => {
                BinaryPjax.loadPreviousUrl();
            }, 500);
        }
    };

    return {
        onLoad,
        requiresTNCApproval,
    };
})();

module.exports = TNCApproval;
