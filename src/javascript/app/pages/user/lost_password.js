const BinaryPjax       = require('../../base/binary_pjax');
const FormManager      = require('../../common/form_manager');
const handleVerifyCode = require('../../common/verification_code').handleVerifyCode;
const localize         = require('../../../_common/localize').localize;
const urlFor           = require('../../../_common/url').urlFor;
const isBinaryApp      = require('../../../config').isBinaryApp;

const LostPassword = (() => {
    const form_id = '#frm_lost_password';

    const responseHandler = (response) => {
        if (response.verify_email) {
            $('#password_reset_description').setVisibility(0);
            $('#password_reset_social').setVisibility(0);
            $('#check_spam').setVisibility(1);
            if (isBinaryApp()) {
                $(form_id).setVisibility(0);
                handleVerifyCode(() => {
                    BinaryPjax.load(`${urlFor('user/reset_passwordws')}#token=${$('#txt_verification_code').val()}`);
                }, false);
            } else {
                $(form_id).html($('<div/>', { class: 'notice-msg', text: localize('Please check your email for the password reset link.') }));
            }
        } else if (response.error) {
            const $form_error = $('#form_error');
            $form_error.text(response.error.message).setVisibility(1);
            $('#email').one('input', () => $form_error.setVisibility(0)); // remove error message on input
        }
    };

    const onLoad = () => {
        FormManager.init(form_id, [
            { selector: '#email', validations: [['req', { hide_asterisk: true }], 'email'], request_field: 'verify_email' },
            { request_field: 'type', value: 'reset_password' },
        ]);
        FormManager.handleSubmit({
            form_selector       : form_id,
            fnc_response_handler: responseHandler,
        });
    };

    return {
        onLoad,
    };
})();

module.exports = LostPassword;
