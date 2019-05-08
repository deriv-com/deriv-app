const QRCode           = require('davidshimjs-qrcodejs');
const Client           = require('../../../../base/client');
const BinarySocket     = require('../../../../base/socket');
const FormManager      = require('../../../../common/form_manager');
const localize         = require('../../../../../_common/localize').localize;
const getPropertyValue = require('../../../../../_common/utility').getPropertyValue;

const TwoFactorAuthentication = (() => {
    const form_id = '#frm_two_factor_auth';
    const state = ['disabled', 'enabled'];

    let $btn_submit,
        $form,
        $two_factor_loading,
        $qrcode_loading,
        $qrcode_key,
        current_state,
        localized_default_error;

    const onLoad = () => {
        $btn_submit         = $('#btn_submit');
        $form               = $(`${form_id}`);
        $two_factor_loading = $('#two_factor_loading');
        $qrcode_loading     = $('#qrcode_loading');
        $qrcode_key         = $('#qrcode_key');

        init();
    };

    const init = () => {
        BinarySocket.send({ account_security: 1, totp_action: 'status' }).then((res) => {
            $two_factor_loading.setVisibility(0);
            localized_default_error = localize('Sorry, an error occurred while processing your request.');

            if (res.error) {
                handleError('status', res.error.message);
                return;
            }

            current_state = state[res.account_security.totp.is_enabled];
            const next_state = state[+(!res.account_security.totp.is_enabled)].slice(0, -1);

            $(`#${current_state}`).setVisibility(1);
            $btn_submit.text(current_state === 'enabled' ? localize('Disable') : localize('Enable'));
            $form.setVisibility(1);

            FormManager.init(form_id, [
                { selector: '#otp', validations: ['req', 'number', ['length', { min: 6, max: 6 }]], request_field: 'otp', no_scroll: true, clear_form_error_on_input: true },
                { request_field: 'account_security', value: 1 },
                { request_field: 'totp_action',      value: next_state },
            ]);
            FormManager.handleSubmit({
                form_selector       : form_id,
                fnc_response_handler: handleSubmitResponse,
                enable_button       : true,
            });

            if (current_state === 'disabled') {
                $form.addClass('padding-left-medium');
                initQRCode();
            }
        });
    };

    const resetComponent = () => {
        $(`#${current_state}`).setVisibility(0);
        $form.setVisibility(0).removeClass('padding-left-medium');
        $qrcode_key.text('');

        $two_factor_loading.setVisibility(1);
        $qrcode_loading.setVisibility(1);

        init();
    };

    const initQRCode = () => {
        BinarySocket.send({ account_security: 1, totp_action: 'generate' }).then((res) => {
            $qrcode_loading.setVisibility(0);

            if (res.error) {
                handleError('generate', res.error.message);
                return;
            }
            const secret_key = res.account_security.totp.secret_key;
            $qrcode_key.text(secret_key);

            makeQrCode(secret_key);
        });
    };

    const makeQrCode = (secret_key) => {
        $('#qrcode').html('');
        const text = `otpauth://totp/${Client.get('email')}?secret=${secret_key}&issuer=Binary.com`;
        const qrcode = new QRCode(document.getElementById('qrcode'), {  // eslint-disable-line no-unused-vars
            text,
            width       : 160,
            height      : 160,
            correctLevel: QRCode.CorrectLevel.H,
        });
    };

    const handleSubmitResponse = (res) => {
        if ('error' in res) {
            showFormMessage(getPropertyValue(res, ['error', 'message']));
        } else {
            $('#otp').val('');
            const localized_text = current_state === 'disabled' ?
                localize('You have successfully enabled two-factor authentication for your account.') :
                localize('You have successfully disabled two-factor authentication for your account.');
            showFormMessage(localized_text, true);
        }
    };

    const handleError = (id, localized_text) => {
        $(`#${id}_error`).text(localized_text || localized_default_error).setVisibility(1);
    };

    const showFormMessage = (localized_text, is_success) => {
        if (is_success) {
            $(`${form_id}_success`)
                .html($('<ul/>', { class: 'checked' }).append($('<li/>', { text: localized_text })))
                .css('display', 'block')
                .delay(3000)
                .fadeOut(1000, resetComponent);
        } else {
            $(`${form_id}_error`).text(localized_text || localized_default_error);
        }
    };

    return {
        onLoad,
    };
})();

module.exports = TwoFactorAuthentication;
