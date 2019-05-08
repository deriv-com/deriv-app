const moment         = require('moment');
const BinaryPjax     = require('../../../../base/binary_pjax');
const Client         = require('../../../../base/client');
const BinarySocket   = require('../../../../base/socket');
const Dialog         = require('../../../../common/attach_dom/dialog');
const showPopup      = require('../../../../common/attach_dom/popup');
const getElementById = require('../../../../../_common/common_functions').getElementById;
const localize       = require('../../../../../_common/localize').localize;
const urlFor         = require('../../../../../_common/url').urlFor;
const State          = require('../../../../../_common/storage').State;

const TopUpVirtualPopup = (() => {
    const form_id  = '#frm_confirm';
    const popup_id = 'top_up_virtual_pop_up';

    const init = (balance) => {
        if (shouldShowPopup(balance)) {
            showTopUpPopup();
        }
    };

    const shouldShowPopup = (balance, should_ignore_hide) => {
        // this is only applicable to virtual clients who are on smart trader page or ladders page
        if (!(Client.get('is_virtual') && (State.get('is_trading') || State.get('is_mb_trading')))) {
            return false;
        }
        // this is only applicable to clients who have less than 1k balance and have not set popup to remain hidden
        const hide_virtual_top_up_until = should_ignore_hide ? 0 : Client.get('hide_virtual_top_up_until');
        if (+balance > 1000 ||
            (hide_virtual_top_up_until && moment.utc().diff(moment.unix(hide_virtual_top_up_until).utc(), 'day') < 1)) {
            return false;
        }

        return true;
    };

    const doTopUp = () => {
        BinarySocket.send({ topup_virtual: '1' }).then((response_top_up) => {
            const el_popup = getElementById(popup_id);
            if (el_popup) {
                el_popup.remove();
            }
            // use Dialog for both error and success since there are no form elements or validation to be done
            if (response_top_up.error) {
                Dialog.alert({
                    id               : 'top_up_error',
                    localized_title  : localize('Top up error'),
                    localized_message: response_top_up.error.message,
                    ok_text          : localize('Understood'),
                });
            } else {
                Dialog.confirm({
                    id               : 'top_up_success',
                    localized_title  : localize('Top-up successful'),
                    localized_message: localize('[_1] has been credited into your Virtual Account: [_2].', ['$10,000.00', Client.get('loginid')]),
                    cancel_text      : localize('Go to statement'),
                    ok_text          : localize('Continue trading'),
                    onAbort          : () => {
                        BinaryPjax.load(urlFor('user/statementws'));
                    },
                });
            }
        });
    };

    const showTopUpPopup = (message) => {
        // use showPopup since we have a checkbox
        showPopup({
            form_id,
            popup_id,
            url               : urlFor('user/top_up_virtual_pop_up'),
            content_id        : '#top_up',
            additionalFunction: () => {
                if (message) {
                    getElementById('top_up_message').textContent = message;
                    getElementById('chk_hide_top_up').parentNode.setVisibility(0);
                }
                const el_redirect = getElementById('top_up_cashier_redirect');
                const el_popup    = getElementById(popup_id);
                el_redirect.addEventListener('click', () => {
                    if (el_popup) {
                        el_popup.remove();
                    }
                });
                const el_cancel = getElementById('btn_cancel');
                el_cancel.addEventListener('click', () => {
                    Client.set('hide_virtual_top_up_until', moment.utc().add(1, 'day').unix());
                    if (el_popup) {
                        el_popup.remove();
                    }
                });
                const el_chk_hide_top_up = getElementById('chk_hide_top_up');
                el_chk_hide_top_up.addEventListener('click', () => {
                    if (el_chk_hide_top_up.checked) {
                        Client.set('hide_virtual_top_up_until', moment.utc().add(10, 'year').unix());
                    } else {
                        Client.set('hide_virtual_top_up_until', moment.utc().unix());
                    }
                });
                const $btn_ok = $('#btn_ok');
                $btn_ok.on('click dblclick', () => { // use this instead of submit as multi click is not handled in submit
                    $btn_ok.attr('disabled', 'disabled');
                    doTopUp();
                });
            },
        });
    };

    return {
        init,
        shouldShow: shouldShowPopup,
        show      : showTopUpPopup,
    };
})();

module.exports = TopUpVirtualPopup;
