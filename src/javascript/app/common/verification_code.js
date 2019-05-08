const FormManager = require('./form_manager');

const handleVerifyCode = (onSubmit, hide_wrapper = true) => {
    const $wrapper = $('#verification_code_wrapper');
    $wrapper.setVisibility(1);
    const verify_form_id = '#frm_verify';
    const verification_code = '#txt_verification_code';
    FormManager.init(verify_form_id, [
        { selector: verification_code, validations: [['req', { hide_asterisk: true }], 'token'], exclude_request: 1 },
    ]);
    FormManager.handleSubmit({
        form_selector       : verify_form_id,
        fnc_response_handler: () => {
            $wrapper.setVisibility(!hide_wrapper);
            if (typeof onSubmit === 'function') {
                onSubmit($(verification_code).val());
            }
        },
    });
};

module.exports = {
    handleVerifyCode,
};
