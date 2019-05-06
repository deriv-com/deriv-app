const Login           = require('../../../_common/base/login');
const CommonFunctions = require('../../../_common/common_functions');

/*
 * Notifications manages various notification messages
 *
 */

const MBNotifications = (() => {
    /*
     * options: Object {
     *     localized_text: {string}  message text to display
     *     uid           : {string}  unique id to prevent duplicating the same message and also used to hide the message
     *     dismissible   : {boolean} dismissible messages can be hidden by client
     * }
     */
    const showErrorMessage = (options) => {
        const $note_wrapper            = getContainer();
        const $this_uid                = $note_wrapper.find(`#${options.uid}`);
        const el_login_error_container = CommonFunctions.getElementById('login_error_container');
        el_login_error_container.setVisibility(0);

        if (/LOGIN_ERROR/.test(options.uid)) {
            el_login_error_container.setVisibility(1);
            const login_error_btn_login = CommonFunctions.getElementById('login_error_btn_login');
            login_error_btn_login.removeEventListener('click', loginOnClick);
            login_error_btn_login.addEventListener('click', loginOnClick);
        } else {
            if (!options.uid || $this_uid.length === 0) {
                $note_wrapper.prepend(generateMessage(options));
            } else if ($this_uid.html() !== options.localized_text) {
                $this_uid.replaceWith(generateMessage(options));
            }

            $.scrollTo($note_wrapper, 500, { offset: -5 });
        }

        hideSpinnerShowTrading();
    };

    const generateMessage = (options) => {
        const $message = $(`<div class="notice-msg gr-12 center-text${(options.dismissible ? ' dismissible' : '')}"
            ${(options.uid ? ` id="${options.uid}"` : '')}>${options.localized_text}
                ${(options.dismissible ? '<div class="notification-dismiss">x</div>' : '')}
            </div>`);

        if (options.dismissible) {
            $message.click(function () { dismissMessage(this); });
        }

        return $message;
    };

    const hideErrorMessage = (uid) => {
        if (uid) {
            getContainer().find(`#${uid}`).remove();
        }
    };

    const dismissMessage = (obj) => {
        $(obj).remove();
    };

    const loginOnClick = (e) => {
        e.preventDefault();
        Login.redirectToLogin();
    };

    const getContainer = () => $('#notifications_wrapper');

    const hideSpinnerShowTrading = () => {
        $('#main_loading').setVisibility(0);
        $('#mb-trading-wrapper').setVisibility(1);
    };

    return {
        hideSpinnerShowTrading,

        show: showErrorMessage,
        hide: hideErrorMessage,
    };
})();

module.exports = MBNotifications;
