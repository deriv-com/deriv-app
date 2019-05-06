const moment              = require('moment');
const BinaryPjax          = require('../../../../base/binary_pjax');
const Client              = require('../../../../base/client');
const Header              = require('../../../../base/header');
const BinarySocket        = require('../../../../base/socket');
const Dialog              = require('../../../../common/attach_dom/dialog');
const Currency            = require('../../../../common/currency');
const FormManager         = require('../../../../common/form_manager');
const DatePicker          = require('../../../../components/date_picker');
const TimePicker          = require('../../../../components/time_picker');
const dateValueChanged    = require('../../../../../_common/common_functions').dateValueChanged;
const localize            = require('../../../../../_common/localize').localize;
const scrollToHashSection = require('../../../../../_common/scroll').scrollToHashSection;

const SelfExclusion = (() => {
    let $form,
        fields,
        self_exclusion_data,
        set_30day_turnover,
        currency,
        is_gamstop_client,
        has_exclude_until;

    const form_id               = '#frm_self_exclusion';
    const timeout_date_id       = '#timeout_until_date';
    const timeout_time_id       = '#timeout_until_time';
    const exclude_until_id      = '#exclude_until';
    const max_30day_turnover_id = '#max_30day_turnover';
    const error_class           = 'errorfield';
    const TURNOVER_LIMIT        = 999999999999999; // 15 digits

    const onLoad = () => {
        $form = $(form_id);

        fields = {};
        $form.find('input').each(function () {
            fields[this.name] = '';
        });

        currency = Client.get('currency');

        $('.prepend_currency').parent().prepend(Currency.formatCurrency(currency));

        // gamstop is only applicable for UK residence & for MX, MLT clients
        is_gamstop_client = /gb/.test(Client.get('residence')) && /iom|malta/.test(Client.get('landing_company_shortcode'));

        initDatePicker();
        getData(true);
    };

    const getData = (scroll) => {
        BinarySocket.send({ get_self_exclusion: 1 }).then((response) => {
            if (response.get_self_exclusion.exclude_until) {
                has_exclude_until = true;
            }
            if (response.error) {
                if (response.error.code === 'ClientSelfExclusion') {
                    Client.sendLogoutRequest();
                }
                if (response.error.message) {
                    $('#msg_error').html(response.error.message).setVisibility(1);
                    $form.setVisibility(0);
                }
                return;
            }
            BinarySocket.send({ get_account_status: 1 }).then((data) => {
                const has_to_set_30day_turnover = !has_exclude_until && /ukrts_max_turnover_limit_not_set/.test(data.get_account_status.status);
                if (typeof set_30day_turnover === 'undefined') {
                    set_30day_turnover = has_to_set_30day_turnover;
                }
                $('#frm_self_exclusion').find('fieldset > div.form-row:not(.max_30day_turnover)').setVisibility(!has_to_set_30day_turnover);
                $('#description_max_30day_turnover').setVisibility(has_to_set_30day_turnover);
                $('#description').setVisibility(!has_to_set_30day_turnover);
                $('#gamstop_info_top').setVisibility(is_gamstop_client);
                $('#loading').setVisibility(0);
                $form.setVisibility(1);
                self_exclusion_data = response.get_self_exclusion;
                $.each(self_exclusion_data, (key, value) => {
                    fields[key] = value.toString();
                    if (key === 'timeout_until') {
                        const timeout = moment.unix(value);
                        const date_value = timeout.format('YYYY-MM-DD');
                        const time_value = timeout.format('HH:mm');
                        setDateTimePicker(timeout_date_id, date_value);
                        setDateTimePicker(timeout_time_id, time_value, true);
                        $form.find('label[for="timeout_until_date"]').text(localize('Timed out until'));
                        return;
                    }
                    if (key === 'exclude_until') {
                        setDateTimePicker(exclude_until_id, value);
                        $form.find('label[for="exclude_until"]').text(localize('Excluded from the website until'));
                        $('#ukgc_gamstop').setVisibility(is_gamstop_client);
                        $('#ukgc_requirement_notice').setVisibility(1);
                        return;
                    }
                    if (key === 'max_30day_turnover') {
                        const should_be_checked = (parseInt(value) === TURNOVER_LIMIT);
                        $('#chk_no_limit').prop('checked', should_be_checked);
                        setMax30DayTurnoverLimit(should_be_checked);
                    }
                    $form.find(`#${key}`).attr('disabled', has_exclude_until).val(value);
                });
                $form.find('#btn_submit').setVisibility(!has_exclude_until);

                $('#chk_no_limit').on('change', function() {
                    setMax30DayTurnoverLimit($(this).is(':checked'));
                });

                bindValidation();
                if (scroll) scrollToHashSection();
            });
        });
    };

    const setDateTimePicker = (id, data_value, is_timepicker = false) => {
        $form.find(id)
            .attr('disabled', has_exclude_until)
            .attr('data-value', data_value)
            .val(is_timepicker ? data_value : moment(data_value).format('DD MMM, YYYY')); // display format
    };

    const setMax30DayTurnoverLimit = (is_checked) => {
        $(max_30day_turnover_id)[is_checked ? 'addClass' : 'removeClass']('hide');
        $(max_30day_turnover_id)
            .attr('disabled', is_checked)
            .val(is_checked ? TURNOVER_LIMIT : '');
    };

    const bindValidation = () => {
        const validations    = [{ request_field: 'set_self_exclusion', value: 1 }];
        const decimal_places = Currency.getDecimalPlaces(currency);

        $form.find('input[type="text"]').each(function () {
            const id = $(this).attr('id');

            if (/timeout_until|exclude_until/.test(id)) return;

            const checks  = [];
            const options = { min: 0 };
            if (id in self_exclusion_data) {
                checks.push('req');
                options.max = self_exclusion_data[id];
            } else {
                options.allow_empty = true;
            }
            if (!/session_duration_limit|max_open_bets/.test(id)) {
                options.type     = 'float';
                options.decimals = decimal_places;
            }
            checks.push(['number', options]);

            if (id === 'session_duration_limit') {
                checks.push(['custom', { func: validSessionDuration, message: localize('Session duration limit cannot be more than 6 weeks.') }]);
            }

            validations.push({
                selector        : `#${id}`,
                validations     : checks,
                exclude_if_empty: 1,
            });
        });

        validations.push(
            {
                selector        : timeout_date_id,
                request_field   : 'timeout_until',
                re_check_field  : timeout_time_id,
                exclude_if_empty: 1,
                value           : getTimeout,
                validations     : [
                    ['custom', { func: () => ($(timeout_time_id).val() ? $(timeout_date_id).val().length : true),                         message: localize('This field is required.') }],
                    ['custom', { func: value => !value.length || getMoment(timeout_date_id).isAfter(moment().subtract(1, 'days'), 'day'), message: localize('Time out must be after today.') }],
                    ['custom', { func: value => !value.length || getMoment(timeout_date_id).isBefore(moment().add(6, 'weeks')),           message: localize('Time out cannot be more than 6 weeks.') }],
                ],
            },
            {
                selector       : timeout_time_id,
                exclude_request: 1,
                re_check_field : timeout_date_id,
                validations    : [
                    ['custom', { func: () => ($(timeout_date_id).val() && getMoment(timeout_date_id).isSame(moment(), 'day') ? $(timeout_time_id).val().length : true), message: localize('This field is required.') }],
                    ['custom', { func: value => !value.length || !$(timeout_date_id).attr('data-value') || (getTimeout() > moment().valueOf() / 1000), message: localize('Time out cannot be in the past.') }],
                    ['custom', { func: validTime, message: localize('Please select a valid time.') }],
                ],
            },
            {
                selector        : exclude_until_id,
                exclude_if_empty: 1,
                value           : () => getDate(exclude_until_id),
                validations     : [
                    ['custom', { func: value => !value.length || getMoment(exclude_until_id).isAfter(moment().add(6, 'months')), message: localize('Exclude time cannot be less than 6 months.') }],
                    ['custom', { func: value => !value.length || getMoment(exclude_until_id).isBefore(moment().add(5, 'years')), message: localize('Exclude time cannot be for more than 5 years.') }],
                ],
            });

        FormManager.init(form_id, validations);
        FormManager.handleSubmit({
            form_selector       : form_id,
            fnc_response_handler: setExclusionResponse,
            fnc_additional_check: additionalCheck,
            enable_button       : true,
        });
    };

    const validSessionDuration = value => (+value <= moment.duration(6, 'weeks').as('minutes'));
    const validTime            = value => !value.length || moment(value, 'HH:mm', true).isValid();

    const getDate    = (elm_id) => {
        const $elm = $(elm_id);
        return $elm.attr('data-value') || (!isNaN(new Date($elm.val()).getTime()) ? $elm.val() : '');
    };
    const getMoment  = elm_id => moment(new Date(getDate(elm_id)));
    const getTimeout = () => (getDate(timeout_date_id) ? (moment(new Date(`${getDate(timeout_date_id)}T${$(timeout_time_id).val()}`)).valueOf() / 1000).toFixed(0) : '');

    const initDatePicker = () => {
        const timeout_time_options = {
            selector: timeout_time_id,
        };

        // timeout_until
        TimePicker.init(timeout_time_options);
        DatePicker.init({
            selector: timeout_date_id,
            minDate : 0,
            maxDate : 6 * 7, // 6 weeks
        });

        // exclude_until
        DatePicker.init({
            selector: exclude_until_id,
            minDate : moment().add(6, 'months').add(1, 'day').toDate(),
            maxDate : 5 * 365, // 5 years
        });

        $(`${timeout_date_id}, ${exclude_until_id}`).change(function () {
            dateValueChanged(this, 'date');
            const date = this.getAttribute('data-value');

            if (timeout_date_id.indexOf(this.id) > 0) {
                const disabled_time_options = {
                    minTime     : 'now',
                    useLocalTime: true,
                };

                // reinitialize timepicker on timeout date change
                TimePicker.init({
                    ...timeout_time_options,
                    ...moment().isBefore(moment(date)) ? undefined : disabled_time_options,
                    datepickerDate: date,
                });
            }

            $('#gamstop_info_bottom').setVisibility(is_gamstop_client && date);
        });
    };

    const additionalCheck = data => (
        new Promise((resolve) => {
            const is_changed = Object.keys(data).some(key => ( // using != in next line since response types is inconsistent
                key !== 'set_self_exclusion' && (!(key in self_exclusion_data) || self_exclusion_data[key] != data[key]) // eslint-disable-line eqeqeq
            ));
            if (!is_changed) {
                showFormMessage(localize('You did not change anything.'), false);
                resolve(false);
            }

            if ('timeout_until' in data || 'exclude_until' in data) {
                Dialog.confirm({
                    id               : 'timeout_until_dialog',
                    localized_message: localize('When you click "OK" you will be excluded from trading on the site until the selected date.'),
                }).then((response) => resolve(response));
            } else {
                resolve(true);
            }
        })
    );

    const setExclusionResponse = (response) => {
        if (response.error) {
            const error_msg = response.error.message;
            let error_fld   = response.error.field;
            if (error_fld) {
                error_fld = /^timeout_until$/.test(error_fld) ? 'timeout_until_date' : error_fld;
                const $error_fld = $(`#${error_fld}`);
                $error_fld.siblings('.error-msg').setVisibility(1).html(error_msg);
                $.scrollTo($error_fld, 500, { offset: -10 });
            } else {
                showFormMessage(error_msg, false);
            }
            return;
        }
        showFormMessage(localize('Your changes have been updated.'), true);
        if ($('#exclude_until').attr('data-value')) {
            $('#gamstop_info_bottom').setVisibility(0);
            $('#ukgc_gamstop').setVisibility(is_gamstop_client);
            $('#ukgc_requirement_notice').setVisibility(1);
        }
        Client.set('session_start', moment().unix()); // used to handle session duration limit
        const { exclude_until, timeout_until } = response.echo_req;
        if (exclude_until || timeout_until) {
            Client.set(
                'excluded_until',
                exclude_until ? moment(exclude_until).unix() : timeout_until
            );
        }
        BinarySocket.send({ get_account_status: 1 }).then(() => {
            Header.displayAccountStatus();
            if (set_30day_turnover) {
                BinaryPjax.loadPreviousUrl();
            } else {
                getData();
            }
        });
    };

    const showFormMessage = (localized_text, is_success) => {
        const $ul = $('<ul/>', { class: 'checked' }).append($('<li/>', { text: localized_text }));
        $('#msg_form')
            .attr('class', is_success ? 'success-msg' : error_class)
            .html(is_success ? $ul : localized_text)
            .css('display', 'block')
            .delay(10000)
            .fadeOut(1000);
    };

    return {
        onLoad,
    };
})();

module.exports = SelfExclusion;
