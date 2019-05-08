const Client           = require('../../../../base/client');
const Header           = require('../../../../base/header');
const BinarySocket     = require('../../../../base/socket');
const Validation       = require('../../../../common/form_validation');
const getElementById   = require('../../../../../_common/common_functions').getElementById;
const isVisible        = require('../../../../../_common/common_functions').isVisible;
const localize         = require('../../../../../_common/localize').localize;
const State            = require('../../../../../_common/storage').State;
const isEmptyObject    = require('../../../../../_common/utility').isEmptyObject;
const showLoadingImage = require('../../../../../_common/utility').showLoadingImage;

const FinancialAssessment = (() => {
    let financial_assessment = {};
    let arr_validation       = [];

    const form_selector = '#frm_assessment';

    const onLoad = () => {
        $(form_selector).on('submit', (event) => {
            event.preventDefault();
            submitForm();
        });
        // TODO [->svg]
        BinarySocket.wait('landing_company').then(() => {
            if (/^(costarica|svg|maltainvest)$/.test(Client.get('landing_company_shortcode'))) {
                getElementById('risk_disclaimer').setVisibility(1);
            }
        });

        getFinancialAssessment();
    };

    const getFinancialAssessment = () => {
        BinarySocket.send({ get_financial_assessment: 1 }).then((response) => {
            handleForm(response.get_financial_assessment);
        });
    };

    const displayHighRiskClassification = () => {
        $('#high_risk_classification').setVisibility(Client.getRiskAssessment());
    };

    const handleForm = (response = State.getResponse('get_financial_assessment')) => {
        hideLoadingImg(!isVisible(getElementById('msg_main')));

        financial_assessment = $.extend({}, response);

        if (isEmptyObject(financial_assessment)) {
            BinarySocket.wait('get_account_status').then(() => { displayHighRiskClassification(); });
        }

        // display Trading Experience only for financial & MT5 financial accounts
        const is_mt5_financial = /labuan_advanced|real_vanuatu_(standard|advanced|mamm_advanced)/.test(localStorage.getItem('financial_assessment_redirect'));
        $('#trading_experience_form').setVisibility(is_mt5_financial || Client.isAccountOfType('financial'));

        Object.keys(financial_assessment).forEach((key) => {
            const val = financial_assessment[key];
            $(`#${key}`).val(val);
        });

        arr_validation = [];
        $(form_selector).find('select').map(function () {
            const id = $(this).attr('id');
            arr_validation.push({ selector: `#${id}`, validations: ['req'] });
            if (financial_assessment[id] === undefined) {  // handle fields not previously set by client
                financial_assessment[id] = '';
            }
        });
        Validation.init(form_selector, arr_validation);
    };

    const submitForm = () => {
        const $btn_submit = $(`${form_selector} #btn_submit`);
        $btn_submit.attr('disabled', 'disabled');

        if (Validation.validate(form_selector)) {
            let has_changed = false;
            Object.keys(financial_assessment).forEach((key) => {
                const $key = $(`#${key}`);
                if ($key.length && $key.val() !== financial_assessment[key]) {
                    has_changed = true;
                }
            });
            if (Object.keys(financial_assessment).length === 0) has_changed = true;
            if (!has_changed) {
                showFormMessage(localize('You did not change anything.'), false);
                setTimeout(() => { $btn_submit.removeAttr('disabled'); }, 1000);
                return;
            }

            const data = { set_financial_assessment: 1 };
            showLoadingImage(getElementById('msg_form'));
            $(form_selector).find('select').each(function () {
                const $this = $(this);
                const value = $this.val();
                const id    = $this.attr('id');
                if (value.length) {
                    financial_assessment[id] = data[id] = value;
                }
            });
            BinarySocket.send(data).then((response) => {
                $btn_submit.removeAttr('disabled');
                if (response.error) {
                    showFormMessage(localize('Sorry, an error occurred while processing your request.'), false);
                } else {
                    showFormMessage(localize('Your changes have been updated successfully.'), true);
                    // need to remove financial_assessment_not_complete from status if any
                    BinarySocket.send({ get_account_status: 1 }).then(() => {
                        Header.displayAccountStatus();
                        displayHighRiskClassification();
                    });
                    getFinancialAssessment();
                }
            });
        } else {
            setTimeout(() => { $btn_submit.removeAttr('disabled'); }, 1000);
        }
    };

    const hideLoadingImg = (show_form) => {
        $('#assessment_loading').remove();
        if (show_form) {
            $(form_selector).setVisibility(1);
        }
    };

    const showFormMessage = (localized_msg, is_success) => {
        const redirect_url = localStorage.getItem('financial_assessment_redirect');
        if (is_success && /metatrader/i.test(redirect_url)) {
            localStorage.removeItem('financial_assessment_redirect');
            $.scrollTo($('h1#heading'), 500, { offset: -10 });
            $(form_selector).setVisibility(0);
            $('#msg_main').setVisibility(1);
        } else {
            $('#msg_form')
                .attr('class', is_success ? 'success-msg' : 'errorfield')
                .html(is_success ? $('<ul/>', { class: 'checked', style: 'display: inline-block;' }).append($('<li/>', { text: localized_msg })) : localized_msg)
                .css('display', 'block')
                .delay(5000)
                .fadeOut(1000);
        }
    };

    const onUnload = () => {
        localStorage.removeItem('financial_assessment_redirect');
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = FinancialAssessment;
