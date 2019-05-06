const FormManager = require('../../common/form_manager');

const TelegramBot = (() => {
    const form = '#frm_telegram_bot';

    const onLoad = () => {
        const bot_name = 'binary_test_bot';

        FormManager.init(form, [
            { selector: '#token', validations: ['req'], exclude_request: 1 },
        ]);

        FormManager.handleSubmit({
            form_selector       : form,
            fnc_response_handler: () => {
                const token = $('#token').val();
                const url   = `https://t.me/${bot_name}/?start=${token}`;
                window.location.assign(url);
            },
        });
    };

    const onUnload = () => {
        $(form).off('submit');
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = TelegramBot;
