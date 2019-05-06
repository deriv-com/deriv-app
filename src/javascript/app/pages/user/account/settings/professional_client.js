const BinaryPjax   = require('../../../../base/binary_pjax');
const Client       = require('../../../../base/client');
const BinarySocket = require('../../../../base/socket');
const FormManager  = require('../../../../common/form_manager');
const State        = require('../../../../../_common/storage').State;

const professionalClient = (() => {
    let is_in_page = false;

    const onLoad = () => {
        BinarySocket.wait('get_settings', 'get_account_status', 'landing_company').then(() => {
            init(Client.isAccountOfType('financial'), true);
        });
    };

    const init = (is_financial, is_page) => {
        is_in_page = !!is_page;
        populateProfessionalClient(is_financial);
    };

    const setVisible = ($selector) => {
        $('#loading').remove();
        $('#frm_professional').setVisibility(0);
        $selector.setVisibility(1);
    };

    const populateProfessionalClient = (is_financial) => {
        const has_maltainvest = State.getResponse('landing_company.financial_company.shortcode') === 'maltainvest';
        if (!has_maltainvest || !is_financial) { // then it's not upgrading to financial
            if (is_in_page) {
                BinaryPjax.loadPreviousUrl();
            }
            return;
        }

        const $professional = $('#professional');
        const $processing   = $('#processing');
        const $rejected     = $('#rejected');
        
        $professional.setVisibility(0);
        $processing.setVisibility(0);
        $rejected.setVisibility(0);

        const status = State.getResponse('get_account_status.status') || [];
        if (is_in_page && status.includes('professional')) {
            setVisible($professional);
            return;
        } else if (is_in_page && status.includes('professional_requested')) {
            setVisible($processing);
            return;
        } else if (is_in_page && status.includes('professional_rejected')) {
            setVisible($rejected);
        }

        const $container        = $('#fs_professional');
        const $chk_professional = $container.find('#chk_professional');
        const $info             = $container.find('#professional_info');
        const $popup_contents   = $container.find('#popup');
        const $error            = $('#form_message');
        const popup_selector    = '#professional_popup';

        $container.find('#professional_info_toggle').off('click').on('click', function() {
            $(this).toggleClass('open');
            $info.slideToggle();
            $(`#${Client.get('residence') === 'gb' ? '' : 'non_'}uk`).toggleClass('invisible');
        });

        $chk_professional.on('change', () => {
            if ($chk_professional.is(':checked')) {
                $error.text('').setVisibility(0);

                if (!$(popup_selector).length) {
                    $('body').append($('<div/>', { id: 'professional_popup', class: 'lightbox' }).append($popup_contents.clone().setVisibility(1)));

                    const $popup = $(popup_selector);
                    $popup.find('#btn_accept, #btn_decline').off('click').on('click dblclick', function () {
                        if ($(this).attr('data-value') === 'decline') {
                            $chk_professional.prop('checked', false);
                        }
                        $popup.remove();
                    });
                }
            }
        });

        $container.setVisibility(1);

        if (is_in_page) {
            $('#loading').remove();
            $('#frm_professional').setVisibility(1);
            FormManager.init('#frm_professional', [{ selector: '#chk_professional', exclude_request: 1, validations: [['req', { hide_asterisk: true }]] }]);
            FormManager.handleSubmit({
                form_selector       : '#frm_professional',
                obj_request         : populateReq(State.getResponse('get_settings')),
                fnc_response_handler: handleResponse,
            });
        }

        $(document).on('keydown click', (e) => {
            const $popup = $(popup_selector);
            if ((e.which === 27 || $(e.target).hasClass('lightbox')) && $popup.length) {
                $popup.remove();
                $chk_professional.prop('checked', false);
            }
        });
    };

    const populateReq = (get_settings) => {
        const req = {
            set_settings               : 1,
            request_professional_status: 1,
        };

        if (get_settings.tax_identification_number) {
            req.tax_identification_number = get_settings.tax_identification_number;
        }
        if (get_settings.tax_residence) {
            req.tax_residence = get_settings.tax_residence;
        }

        return req;
    };

    const handleResponse = (response) => {
        if (response.error) {
            $('#form_message').text(response.error.message).setVisibility(1);
        } else {
            BinarySocket.send({ get_account_status: 1 }).then(() => {
                populateProfessionalClient(true);
            });
        }
    };

    return {
        onLoad,
        init,
    };
})();

module.exports = professionalClient;
