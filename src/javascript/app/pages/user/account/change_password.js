const BinaryPjax   = require('../../../base/binary_pjax');
const Client       = require('../../../base/client');
const BinarySocket = require('../../../base/socket');
const FormManager  = require('../../../common/form_manager');
const localize     = require('../../../../_common/localize').localize;
const State        = require('../../../../_common/storage').State;

const ChangePassword = (() => {
    const form_id = '#frm_change_password';

    const init = () => {
        FormManager.init(form_id, [
            { selector: '#old_password',    validations: ['req', ['length', { min: 6, max: 25 }]] },
            { selector: '#new_password',    validations: ['req', 'password', ['not_equal', { to: '#old_password', name1: localize('Current password'), name2: localize('New password') }]], re_check_field: '#repeat_password' },
            { selector: '#repeat_password', validations: ['req', ['compare', { to: '#new_password' }]], exclude_request: 1 },

            { request_field: 'change_password', value: 1 },
        ]);
        FormManager.handleSubmit({
            form_selector       : form_id,
            fnc_response_handler: handler,
        });
    };

    const handler = (response) => {
        if ('error' in response) {
            $('#form_error').text(response.error.message).setVisibility(1);
        } else {
            $(form_id).setVisibility(0);
            $('#msg_success').setVisibility(1);
            setTimeout(() => {
                Client.sendLogoutRequest(true);
            }, 5000);
        }
    };

    const onLoad = () => {
        BinarySocket.wait('get_account_status').then(() => {
            const status = State.getResponse('get_account_status.status');
            if (!/social_signup/.test(status)) {
                init();
            } else {
                BinaryPjax.loadPreviousUrl();
            }
        });
    };

    return {
        onLoad,
    };
})();

module.exports = ChangePassword;

