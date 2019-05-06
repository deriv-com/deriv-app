const BinaryPjax   = require('../../../../base/binary_pjax');
const BinarySocket = require('../../../../base/socket');
const FormManager  = require('../../../../common/form_manager');
const localize     = require('../../../../../_common/localize').localize;

const CashierPassword = (() => {
    const form_id = '#frm_cashier_password';

    let should_redirect = false;

    let $form;

    const onLoad = () => {
        $form = $(form_id);

        BinarySocket.wait('authorize').then(() => {
            BinarySocket.send({ cashier_password: 1 }).then(response => init(response));
        });
    };

    const updatePage = (config) => {
        $('legend').text(config.legend);
        $('#lockInfo').text(config.info);
        $form.find('button').html(config.button);
    };

    const init = (response) => {
        const locked = response.cashier_password;
        if (response.error) {
            $('#form_message').addClass('notice-msg center-text').text(response.error.code === 'RateLimit' ? localize('You have reached the rate limit of requests per second. Please try later.') : response.error.message);
            return;
        } else if (locked) {
            updatePage({
                legend: localize('Unlock Cashier'),
                info  : localize('Your cashier is locked as per your request - to unlock it, please enter the password.'),
                button: localize('Unlock Cashier'),
            });
            $('#repeat_password_row').setVisibility(0);
        } else {
            updatePage({
                legend: localize('Lock Cashier'),
                info  : localize('An additional password can be used to restrict access to the cashier.'),
                button: localize('Update'),
            });
            $('#repeat_password_row').setVisibility(1);
        }
        $form.setVisibility(1);
        FormManager.init(form_id, [
            { selector: '#cashier_password',        validations: ['req', locked ? ['length', { min: 6, max: 25 }] : 'password'], request_field: locked ? 'unlock_password' : 'lock_password', re_check_field: locked ? null : '#repeat_cashier_password' },
            { selector: '#repeat_cashier_password', validations: ['req', ['compare', { to: '#cashier_password' }]], exclude_request: 1 },

            { request_field: 'cashier_password', value: 1 },
        ]);
        FormManager.handleSubmit({
            form_selector       : form_id,
            fnc_response_handler: handleResponse,
        });
    };

    const handleResponse = (response) => {
        const $form_error   = $('#form_error');
        const $form_message = $('#form_message');
        $form_message.removeClass('notice-msg center-text').text('');
        $form_error.setVisibility(0);
        if (response.error) {
            if (response.error.code === 'RateLimit') {
                $form.setVisibility(0);
                $form_message.addClass('notice-msg center-text').text(localize('You have reached the rate limit of requests per second. Please try later.'));
            } else {
                let message = response.error.message;
                if (response.error.code === 'InputValidationFailed') {
                    message = localize('Sorry, you have entered an incorrect cashier password');
                }
                $form_error.text(message).setVisibility(1);
            }
        } else {
            $form.setVisibility(0);
            $form_message.text(localize('Your settings have been updated successfully.'));
            setTimeout(redirect, 2000);
        }
    };

    const redirect = () => {
        if (should_redirect) {
            should_redirect = false;
            BinaryPjax.loadPreviousUrl();
        }
    };

    return {
        onLoad,

        setShouldRedirect: (bool) => { should_redirect = bool; },
    };
})();

module.exports = CashierPassword;
