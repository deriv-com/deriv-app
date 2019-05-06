const RealityCheckData     = require('./reality_check.data');
const showLocalTimeOnHover = require('../../../base/clock').showLocalTimeOnHover;
const BinarySocket         = require('../../../base/socket');
const FormManager          = require('../../../common/form_manager');
const urlFor               = require('../../../../_common/url').urlFor;
require('../../../../_common/lib/polyfills/array.includes');
require('../../../../_common/lib/polyfills/string.includes');

const RealityCheckUI = (() => {
    const summary_url   = urlFor('user/reality_check_summary');
    const frequency_url = urlFor('user/reality_check_frequency');
    const form          = {
        selector            : '#frm_reality_check',
        num_reality_duration: '#num_reality_duration',
    };

    let reality_timeout;

    const getAjax = (summary) => {
        $.ajax({
            url     : summary ? summary_url : frequency_url,
            dataType: 'html',
            method  : 'GET',
            success : (reality_check_text) => {
                ajaxSuccess(reality_check_text, summary);
            },
        });
    };

    const ajaxSuccess = (reality_check_text, summary) => {
        const content = 'reality_check_content';
        if (reality_check_text.includes(content) && $('#reality_check').length === 0) {
            $('body').append($('<div/>', { id: 'reality_check', class: 'lightbox' }).append($(reality_check_text).find(`#${content}`)));
            $(form.num_reality_duration).val(Math.floor(+RealityCheckData.get('interval') / 60 / 1000));
            $('#statement').off('click').on('click dblclick', onStatementClick);
            $('#logout').off('click').on('click dblclick', onLogoutClick);
            if (summary) {
                updateSummary(summary);
            }
            bindValidation();
        }
    };

    const updateSummary = (summary) => {
        $('#start_time').text(summary.start_time_string);
        $('#login_time').text(summary.login_time);
        $('#current_time').text(summary.current_time);
        $('#session_duration').text(summary.session_duration);

        $('#loginid').text(summary.loginid);
        $('#rc_currency').text(summary.currency);
        $('#turnover').html(summary.turnover);
        $('#profit_loss').html(summary.profit_loss);
        $('#bought').text(summary.contracts_bought);
        $('#sold').text(summary.contracts_sold);
        $('#open').text(summary.open_contracts);
        $('#potential').html(summary.potential_profit);

        showLocalTimeOnHover('#start_time, #login_time, #current_time');
    };

    const handleKeypress = (ev) => {
        const char = String.fromCharCode(ev.which);
        if ((!/[0-9]/.test(char) && [8, 37, 39].indexOf(ev.keyCode) < 0) ||
            /['%]/.test(char)) { // similarity to arrows key code in some browsers
            ev.preventDefault();
        }
    };

    const bindValidation = () => {
        $(form.num_reality_duration).off('keypress').on('keypress', handleKeypress);
        FormManager.init(form.selector, [
            { selector: form.num_reality_duration, validations: ['req', ['number', { min: 10, max: 60 }]], exclude_request: 1, no_scroll: 1 },
        ]);
        FormManager.handleSubmit({
            form_selector       : form.selector,
            fnc_response_handler: responseHandler,
        });
    };

    const responseHandler = () => {
        const interval_minute = +($(form.num_reality_duration).val());
        RealityCheckData.set('interval', interval_minute * 60 * 1000);
        RealityCheckData.set('keep_open', 0);
        RealityCheckData.set('ack', 1);
        closePopUp();
    };

    const onStatementClick = () => {
        const win = window.open(`${urlFor('user/statementws')}#no-reality-check`, '_blank');
        if (win) {
            win.focus();
        }
    };

    const onLogoutClick = () => {
        BinarySocket.send({ logout: '1' });
    };

    const closePopUp = () => {
        $('#reality_check').remove();
        startSummaryTimer();
        // TODO: uncomment below to enable interview popup dialog
        // InterviewPopup.onLoad();
    };

    const startSummaryTimer = () => {
        const interval = +RealityCheckData.get('interval');

        clearTimeout(reality_timeout);
        reality_timeout = setTimeout(() => {
            RealityCheckData.set('keep_open', 1);
            getSummaryAsync();
        }, interval);
    };

    const shouldShowPopup = () => {
        const location = window.location;
        return !(/no-reality-check/.test(location.hash) && /statementws/.test(location.pathname));
    };

    const getSummaryAsync = () => {
        if (RealityCheckUI.shouldShowPopup()) {
            BinarySocket.send({ reality_check: 1 }).then((response) => {
                if (response.error && !/user\/statementws\.html/.test(window.location.pathname)) { // don't block statement page for reality check error, but block all other pages
                    $('#content').empty().html($('<div/>', { class: 'container' }).append($('<p/>', { class: 'notice-msg center-text', text: response.error.message })));
                } else if (response.reality_check) {
                    getAjax(RealityCheckData.summaryData(response.reality_check));
                }
            });
        }
    };

    return {
        closePopUp,
        startSummaryTimer,
        getSummaryAsync,
        shouldShowPopup,

        renderFrequencyPopUp: () => { getAjax(); },
        getRealityTimeout   : () => reality_timeout,
    };
})();

module.exports = RealityCheckUI;
