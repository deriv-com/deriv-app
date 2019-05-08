const moment           = require('moment');
const ServerTime       = require('../../_common/base/server_time');
const elementInnerHtml = require('../../_common/common_functions').elementInnerHtml;
const getElementById   = require('../../_common/common_functions').getElementById;

const Clock = (() => {
    let el_clock,
        fncExternalTimer;

    const startClock = () => {
        if (!el_clock) {
            el_clock = getElementById('gmt-clock');
        }

        ServerTime.init(onTimeUpdated);
    };

    const onTimeUpdated = () => {
        const server_time = ServerTime.get();
        window.time = server_time;

        const time_str = `${server_time.format('YYYY-MM-DD HH:mm:ss')} GMT`;
        elementInnerHtml(el_clock, time_str);
        showLocalTimeOnHover('#gmt-clock');

        if (typeof fncExternalTimer === 'function') {
            fncExternalTimer();
        }
    };

    const showLocalTimeOnHover = (selector) => {
        document.querySelectorAll(selector || '.date').forEach((el) => {
            const gmt_time_str = el.textContent.replace('\n', ' ');
            const local_time   = moment.utc(gmt_time_str, 'YYYY-MM-DD HH:mm:ss').local();
            if (local_time.isValid()) {
                el.setAttribute('data-balloon', local_time.format('YYYY-MM-DD HH:mm:ss Z'));
            }
        });
    };

    return {
        startClock,
        showLocalTimeOnHover,

        setExternalTimer: (func) => { fncExternalTimer = func; },
    };
})();

module.exports = Clock;
