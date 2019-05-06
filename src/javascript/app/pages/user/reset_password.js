const generateBirthDate = require('../../common/attach_dom/birth_date_picker');
const FormManager       = require('../../common/form_manager');
const Login             = require('../../../_common/base/login');
const localize          = require('../../../_common/localize').localize;

const ResetPassword = (() => {
    const responseHandler = (response) => {
        $('#container_reset_password').setVisibility(0);
        if (response.error) {
            const $form_error          = $('#form_error');
            const error_code           = response.error.code;

            $('#msg_reset_password').setVisibility(0);

            let err_msg;
            if (error_code === 'SocialBased') {
                err_msg = response.error.message;
                $form_error.find('a').setVisibility(0);
            } else { // special handling as backend return inconsistent format
                err_msg = localize('[_1] Please click the link below to restart the password recovery process.', error_code === 'InputValidationFailed' ? localize('There was some invalid character in an input field.') : response.error.message);
            }

            $('#form_error_msg').text(err_msg);
            $form_error.setVisibility(1);
        } else {
            $('#msg_reset_password').text(localize('Your password has been successfully reset. Please log into your account using your new password.')).setVisibility(1);
            setTimeout(() => {
                Login.redirectToLogin();
            }, 5000);
        }
    };

    const onLoad = () => {
        generateBirthDate();

        $('#have_real_account').off('click').on('click', () => {
            if ($('#have_real_account_option_0').is(':checked')) {
                $('#dob_field').setVisibility(1);
            } else {
                $('#dob_field').setVisibility(0);
            }
        });

        const form_id = '#frm_reset_password';
        FormManager.init(form_id, [
            { selector: '#have_real_account',  validations: ['req'], exclude_request: 1 },
            { selector: '#date_of_birth',      validations: ['req'] },
            { selector: '#new_password',       validations: ['req', 'password'], re_check_field: '#repeat_password' },
            { selector: '#repeat_password',    validations: ['req', ['compare', { to: '#new_password' }]], exclude_request: 1 },
            { request_field: 'reset_password', value: 1 },
        ], true);

        FormManager.handleSubmit({
            form_selector       : form_id,
            fnc_response_handler: responseHandler,
        });
    };

    return {
        onLoad,
    };
})();

module.exports = ResetPassword;
