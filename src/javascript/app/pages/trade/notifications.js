/*
 * Notifications manages various notification messages
 *
 */

const Notifications = (() => {
    /*
     * options: Object {
     *     text       : {string}  message text to display
     *     uid        : {string}  unique id to prevent duplicating the same message and also used to hide the message
     *     dismissible: {boolean} dismissible messages can be hidden by client
     * }
     */
    const showErrorMessage = (options) => {
        const $note_wrapper = getContainer();
        const $this_uid     = $note_wrapper.find(`#${options.uid}`);

        if (!options.uid || $this_uid.length === 0) {
            $note_wrapper.prepend(generateMessage(options));
        } else if ($this_uid.html() !== options.text) {
            $this_uid.replaceWith(generateMessage(options));
        }

        $.scrollTo($note_wrapper, 500, { offset: -5 });
    };

    const generateMessage = (options) => {
        const $message = $(`<div class="notice-msg center-text${(options.dismissible ? ' dismissible' : '')}"
            ${(options.uid ? ` id="${options.uid}"` : '')}>${options.text}
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

    const getContainer = () => $('#notifications_wrapper');

    return {
        show: showErrorMessage,
        hide: hideErrorMessage,
    };
})();

module.exports = Notifications;
