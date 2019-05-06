const Cookies          = require('js-cookie');
const BinarySocket     = require('./socket');
const Client           = require('../base/client');
const isEuCountry      = require('../common/country_base').isEuCountry;
const RealityCheckData = require('../pages/user/reality_check/reality_check.data');

const InterviewPopup = (() => {
    const onLoad = () => {
        BinarySocket.wait('authorize', 'website_status', 'get_account_status').then(() => {
            const is_interview_consent  = Cookies.get('InterviewConsent');
            const $interview_popup      = $('#interview_popup_container');
            const $interview_no_thanks  = $('#interview_no_thanks');
            const $interview_ask_later  = $('#interview_ask_later');
            const $interview_interested = $('#interview_interested');

            if (Client.isLoggedIn()
                && isEuCountry()
                && !is_interview_consent
                && !((RealityCheckData.get('keep_open') === false
                || RealityCheckData.get('keep_open') === 1))) {
                setTimeout(() => {
                    $interview_popup.removeClass('invisible');
                }, 2000);
                $interview_no_thanks.one('click', () => {
                    Cookies.set('InterviewConsent', 1);
                    $interview_popup.addClass('invisible');
                });
                $interview_ask_later.one('click', () => {
                    const interval_time = 1 / 12;
                    Cookies.set('InterviewConsent', 1, {
                        expires: interval_time,
                    });
                    $interview_popup.addClass('invisible');
                });
                $interview_interested.one('click', () => {
                    BinarySocket.wait('get_settings').then((response) => {
                        const get_settings = response.get_settings || {};
                        const url = 'https://docs.google.com/forms/d/e/1FAIpQLSccg8p-GjoBufjAnMJJUZHJ_1YqlS_GyQyy5vQdgGm4VKmnMg/viewform?usp=pp_url';
                        const pre_name    = `&entry.909179306=${get_settings.first_name}%20${get_settings.last_name}`;
                        const pre_email   = `&entry.81172074=${get_settings.email}`;
                        const pre_country = `&entry.141529718=${get_settings.country}`;
                        const pre_phone   = `&entry.1442583433=${get_settings.phone}`;
                        const encode_uri  =  (`${url}${pre_name}${pre_email}${pre_country}${pre_phone}`).replace(/\+/g, '%2B');
                        $interview_popup.addClass('invisible');
                        Cookies.set('InterviewConsent', 1);
                        window.open(encode_uri, '_blank');
                    });
                });
            }
        });
    };

    return {
        onLoad,
    };
})();

module.exports = InterviewPopup;
