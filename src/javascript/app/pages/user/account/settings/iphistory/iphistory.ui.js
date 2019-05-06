const moment               = require('moment');
const showLocalTimeOnHover = require('../../../../../base/clock').showLocalTimeOnHover;
const FlexTableUI          = require('../../../../../common/attach_dom/flextable');
const localize             = require('../../../../../../_common/localize').localize;

const IPHistoryUI = (() => {
    const container_selector = '#login-history-container';

    const formatRow = (data) => {
        const timestamp    = `${moment.unix(data.time).utc().format('YYYY-MM-DD HH:mm:ss').replace(' ', '\n')} GMT`;
        const status       = data.success ? localize('Successful') : localize('Failed');
        const action       = localize(data.action /* localize-ignore */);  // from login_history API call, can be (login|logout)
        const browser      = data.browser;
        let browser_string = browser ? `${browser.name} v${browser.version}` : 'Unknown';
        const patt         = /^(opera|chrome|safari|firefox|IE|Edge|SeaMonkey|Chromium|Binary app) v[0-9.]+$/i;
        if (!patt.test(browser_string) && browser_string !== 'Unknown') {
            browser_string = 'Error';
        }
        return [
            timestamp,
            action,
            browser_string,
            data.ip_addr,
            status,
        ];
    };

    const update = (history) => {
        FlexTableUI.init({
            id       : 'login-history-table',
            container: container_selector,
            header   : localize(['Date and Time', 'Action', 'Browser', 'IP Address', 'Status']),
            cols     : ['timestamp', 'action', 'browser', 'ip', 'status'],
            data     : history,
            formatter: formatRow,
            style    : ($row) => {
                $row.children('.timestamp').addClass('pre');
            },
        });
        if (!history.length) {
            return FlexTableUI.displayError(localize('Your account has no Login/Logout activity.'), 6);
        }
        return showLocalTimeOnHover('td.timestamp');
    };

    const clean = () => {
        $(container_selector).find('.error-msg').text('');
        FlexTableUI.clear();
    };

    const displayError = (error) => {
        $('#err').text(error);
    };

    return {
        clean,
        update,
        displayError,
    };
})();

module.exports = IPHistoryUI;
