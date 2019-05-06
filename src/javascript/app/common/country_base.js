const Client = require('../base/client');
const State  = require('../../_common/storage').State;

// will return true for all clients with maltainvest/malta/iom financial/gaming landing company shortcode
// needs to wait for website_status, authorize, and landing_company before being called
// 'mt' is part of EU but account opening is not offered so the landing company response won't include the expected shortcode.
// we will use the fallback eu_excluded_regex for them.
const isEuCountry = () => {
    const eu_shortcode_regex  = new RegExp('^(maltainvest|malta|iom)$');
    const eu_excluded_regex   = new RegExp('^mt$');
    const financial_shortcode = State.getResponse('landing_company.financial_company.shortcode');
    const gaming_shortcode    = State.getResponse('landing_company.gaming_company.shortcode');
    const clients_country     = Client.get('residence') || State.getResponse('website_status.clients_country');
    return (
        (financial_shortcode || gaming_shortcode) ?
            (eu_shortcode_regex.test(financial_shortcode) || eu_shortcode_regex.test(gaming_shortcode)) :
            eu_excluded_regex.test(clients_country)
    );
};

const isIndonesia = () => State.getResponse('website_status.clients_country') === 'id';

const isExcludedFromCfd = () => {
    const cfd_excluded_regex = new RegExp('^fr$');
    const clients_country = Client.get('residence') || State.getResponse('website_status.clients_country');
    return cfd_excluded_regex.test(clients_country);
};

module.exports = {
    isEuCountry,
    isIndonesia,
    isExcludedFromCfd,
};
