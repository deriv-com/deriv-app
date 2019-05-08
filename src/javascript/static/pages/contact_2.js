const moment       = require('moment');
const Dropdown     = require('@binary-com/binary-style').selectDropdown;
const BinarySocket = require('../../_common/base/socket_base');

const Contact = (() => {
    let $chat_button,
        $chat_unavailable,
        livechat_timeout;

    const onLoad = () => {
        $chat_button      = $('#chat_button');
        $chat_unavailable = $('#live_chat_unavailable');
        showHideLiveChat();
        initPhoneNumber();
    };

    const initPhoneNumber = (is_one_line) => {
        Dropdown('#cs_telephone_number');
        $('#cs_telephone_number').on('change.cs', function () {
            const val = $(this).val().split(',').map(raw_str => (
                is_one_line ? `<span>${wrapNumberInLink(raw_str)}</span>` : wrapNumberInLink(raw_str)
            ));
            $('#display_cs_telephone').html(val[0] + (val.length > 1 ? `${is_one_line ? '' : '<br />'}${val[1]}` : ''));
        });
    };

    const wrapNumberInLink = (raw_str) => {
        const str = raw_str.trim();
        const m = str.match(/ \(Toll Free\)/i);
        const number = m ? str.slice(0, m.index) : str;
        const append = m ? str.slice(m.index) : '';
        return `<a href="tel:${number}">${number}</a>${append}`;
    };

    const isWeekday = (moment_obj) => !/^(0|6)$/.test(moment_obj.day()); // 0 for sunday and 6 for saturday

    const availability = [
        [8, 17], // weekends (sat-sun): 08-17 MYT
        [6, 21], // weekdays (mon-fri): 06-21 MYT
    ];

    const showHideLiveChat = () => {
        BinarySocket.wait('time').then(() => {
            const moment_now   = moment.utc(window.time || undefined).utcOffset(8); // MYT
            const hour         = moment_now.hour();
            const config       = availability[+isWeekday(moment_now)];
            const is_available = hour >= config[0] && hour < config[1];
            const moment_next  = moment_now.clone();

            let next_hour;
            if (is_available) {
                $chat_button.attr({ href: 'https://binary.desk.com/customer/widget/chats/new', target: '_blank' }).removeClass('button-disabled');
                $chat_unavailable.setVisibility(0);
                next_hour = config[1];
            } else {
                $chat_button.attr({ href: '', target: '' }).addClass('button-disabled');
                $chat_unavailable.setVisibility(1);
                if (hour < config[0]) {
                    next_hour = config[0];
                } else {
                    moment_next.add(1, 'days');
                    next_hour = availability[+isWeekday(moment_next)][0];
                }
            }
            moment_next.hour(next_hour).minute(0).second(0);

            livechat_timeout = setTimeout(showHideLiveChat, moment_next.diff(moment_now));
        });
    };

    const onUnload = () => {
        clearTimeout(livechat_timeout);
    };

    return {
        onLoad,
        onUnload,
        initPhoneNumber,
    };
})();

module.exports = Contact;
