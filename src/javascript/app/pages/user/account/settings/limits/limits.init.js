const LimitsUI           = require('./limits.ui');
const Client             = require('../../../../../base/client');
const formatMoney        = require('../../../../../common/currency').formatMoney;
const elementTextContent = require('../../../../../../_common/common_functions').elementTextContent;
const getElementById     = require('../../../../../../_common/common_functions').getElementById;
const localize           = require('../../../../../../_common/localize').localize;
const getPropertyValue   = require('../../../../../../_common/utility').getPropertyValue;

const LimitsInit = (() => {
    const limitsHandler = (response, response_get_account_status, response_active_symbols) => {
        const limits = response.get_limits;
        LimitsUI.fillLimitsTable(limits, response_active_symbols);

        const el_withdraw_limit     = getElementById('withdrawal-limit');
        const el_withdrawn          = getElementById('already-withdraw');
        const el_withdraw_limit_agg = getElementById('withdrawal-limit-aggregate');

        if (/authenticated/.test(getPropertyValue(response_get_account_status, ['get_account_status', 'status']))) {
            elementTextContent(el_withdraw_limit, localize('Your account is fully authenticated and your withdrawal limits have been lifted.'));
        } else {
            const currency   = Client.get('currency') || Client.currentLandingCompany().legal_default_currency;
            const days_limit = formatMoney(currency, limits.num_of_days_limit, 1);
            const remainder  = formatMoney(currency, limits.remainder, 1);

            if (Client.get('landing_company_shortcode') === 'iom') {
                elementTextContent(el_withdraw_limit,
                    localize('Your [_1] day withdrawal limit is currently [_2] [_3] (or equivalent in other currency).', [limits.num_of_days, currency, days_limit]));
                elementTextContent(el_withdrawn,
                    localize('You have already withdrawn the equivalent of [_1] [_2] in aggregate over the last [_3] days.', [currency, limits.withdrawal_for_x_days_monetary, limits.num_of_days]));
                elementTextContent(el_withdraw_limit_agg,
                    localize('Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2] (or equivalent in other currency).', [currency, remainder]));
            } else if (Client.get('landing_company_shortcode') === 'costarica' || Client.get('landing_company_shortcode') === 'svg') {
                // TODO [->svg]
                elementTextContent(el_withdraw_limit,
                    localize('Your withdrawal limit is [_1] [_2].', [currency, days_limit]));
                elementTextContent(el_withdrawn,
                    localize('You have already withdrawn [_1] [_2].', [currency, limits.withdrawal_since_inception_monetary]));
                elementTextContent(el_withdraw_limit_agg,
                    localize('Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2].', [currency, remainder]));
            } else {
                elementTextContent(el_withdraw_limit,
                    localize('Your withdrawal limit is [_1] [_2] (or equivalent in other currency).', [currency, days_limit]));
                elementTextContent(el_withdrawn,
                    localize('You have already withdrawn the equivalent of [_1] [_2].', [currency, limits.withdrawal_since_inception_monetary]));
                elementTextContent(el_withdraw_limit_agg,
                    localize('Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2] (or equivalent in other currency).', [currency, remainder]));
            }
        }
    };

    const limitsError = (error) => {
        getElementById('withdrawal-title').setVisibility(0);
        getElementById('limits-title').setVisibility(0);
        $('#limits_error').append($('<p/>', { class: 'center-text notice-msg', text: error && error.message ? error.message : localize('Sorry, an error occurred while processing your request.') }));
    };

    const initTable = () => {
        LimitsUI.clearTableContent();
    };

    return {
        limitsHandler,
        limitsError,

        clean: initTable,
    };
})();

module.exports = LimitsInit;
