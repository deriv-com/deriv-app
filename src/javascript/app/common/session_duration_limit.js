const moment           = require('moment');
const Client           = require('../base/client');
const localize         = require('../../_common/localize').localize;
const getPropertyValue = require('../../_common/utility').getPropertyValue;

const SessionDurationLimit = (() => {
    let warning,
        timeout_before,
        timeout,
        timeout_logout;

    const init = () => {
        clearTimeout(timeout_before);
        clearTimeout(timeout);
        clearTimeout(timeout_logout);
        $('#session_limit').remove();

        warning = 10 * 1000; // milliseconds before limit to display the warning message

        const limit      = Client.get('session_duration_limit') * 1;
        const now        = moment().unix();
        const start      = Client.get('session_start') * 1;
        const math_limit = Math.pow(2, 31) - 1;
        let remained     = ((limit + start) - now) * 1000;
        if (remained < 0) remained = warning;

        const setTimeOut = () => {
            timeout        = setTimeout(displayWarning, remained - warning);
            timeout_logout = setTimeout(Client.sendLogoutRequest, remained);
        };

        // limit of setTimeout is this number
        if (remained > math_limit) {
            remained %= math_limit;
            timeout_before = setTimeout(init, remained);
        } else {
            setTimeOut();
        }
    };

    const exclusionResponseHandler = (response) => {
        if (getPropertyValue(response, 'error') || !getPropertyValue(response, 'get_self_exclusion')) {
            return;
        }

        const limit = response.get_self_exclusion.session_duration_limit * 60;
        if (isNaN(limit) || limit <= 0) return;

        Client.set('session_duration_limit', limit);
        window.addEventListener('storage', init, false);

        init();
    };

    const displayWarning = () => {
        $('body').append($('<div/>', { id: 'session_limit', class: 'lightbox' })
            .append($('<div/>', { class: 'gr-padding-10 gr-gutter', text: localize('Your session duration limit will end in [_1] seconds.', warning / 1000) })));
        $('#session_limit').click(function () { $(this).remove(); });
    };

    return {
        exclusionResponseHandler,
    };
})();

module.exports = SessionDurationLimit;
