const loadScript   = require('scriptjs');
const BinarySocket = require('../../../../app/base/socket');
const isEuCountry  = require('../../../../app/common/country_base').isEuCountry;
const getLanguage  = require('../../../../_common/language').get;

const EconomicCalendar = (() => {
    let is_loaded;

    const onLoad = () => {

        const curr_language = getLanguage().toLowerCase();

        if (!is_loaded) {
            loadScript.get('https://c.mql5.com/js/widgets/calendar/widget.v3.js', () => {
                populateCalendar(curr_language);
                is_loaded = true;
            });
        } else {
            populateCalendar(curr_language);
        }
    };

    const populateCalendar = (lang) => {
        new economicCalendar({ width: '100%', height: '500px', mode: 2, lang }); // eslint-disable-line new-cap, no-new, no-undef
        const loader = $('#economicCalendarWidget').find('.barspinner');
        if (loader) loader.remove();

        BinarySocket.wait('website_status', 'authorize', 'landing_company').then(() => {
            $('.calendar-footer').setVisibility(isEuCountry());
        });
    };

    return {
        onLoad,
    };
})();

module.exports = EconomicCalendar;
