const moment           = require('moment');
const DatePicker       = require('../../components/date_picker');
const dateValueChanged = require('../../../_common/common_functions').dateValueChanged;
const localize         = require('../../../_common/localize').localize;
const toISOFormat      = require('../../../_common/string_util').toISOFormat;

const getDatePickerValue = (selector, is_end_of_day) => {
    const val = $(selector).attr('data-value');
    const getEpochTime = () => is_end_of_day ? moment.utc(val).endOf('day').unix() : moment.utc(val).unix();
    return val ? getEpochTime() : 0;
};

const getDateToFrom = () => {
    const date_to_val = $('#date_to').attr('data-value');
    let date_to,
        date_from;
    if (date_to_val) {
        date_to   = moment.utc(date_to_val).unix() + (24 * (60 * 60));
        date_from = 0;
    }
    return {
        date_to,
        date_from,
    };
};

const attachDateToPicker = (fncOnChange) => {
    const id_date_to = '#date_to';
    const $date_to   = $(id_date_to);
    $date_to
        .attr('data-value', toISOFormat(moment.utc()))
        .change(function () {
            if (!dateValueChanged(this, 'date')) {
                return false;
            }
            $('.table-container').remove();
            if (typeof fncOnChange === 'function') {
                fncOnChange();
            }
            return true;
        });
    DatePicker.init({
        selector: id_date_to,
        maxDate : 0,
    });
    if ($date_to.attr('data-picker') !== 'native') $date_to.val(localize('Today'));
};

const attachDateRangePicker = (date_from_id, date_to_id, fncOnChange) => {
    const onChange = (e) => {
        if (!dateValueChanged(e, 'date')) {
            return false;
        }
        if (typeof fncOnChange === 'function') {
            fncOnChange();
        }
        return true;
    };

    const initDatePicker = (id, opts) => {
        const $datepicker = $(id);
        DatePicker.init({
            selector: id,
            maxDate : 0,
            ...opts,
        });
        if ($datepicker.attr('data-picker') !== 'native') $datepicker.attr('placeholder', localize('Select date'));
        $datepicker.change((e) => {
            onChange(e.currentTarget);
            if (!$datepicker.is($(date_to_id))) {
                // reset date_to datepicker with new min_date
                $(date_to_id).val('').removeAttr('data-value');
                initDatePicker(date_to_id, { minDate: new Date(e.target.value) });
            }
        });
    };

    initDatePicker(date_from_id);
    initDatePicker(date_to_id);
};

module.exports = {
    attachDateToPicker,
    attachDateRangePicker,
    getDatePickerValue,
    getDateToFrom,
};
