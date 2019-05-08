const moment           = require('moment');
const checkInput       = require('../../_common/common_functions').checkInput;
const localize         = require('../../_common/localize').localize;
const padLeft          = require('../../_common/string_util').padLeft;
const toReadableFormat = require('../../_common/string_util').toReadableFormat;
const clearable        = require('../../_common/utility').clearable;
const isEmptyObject    = require('../../_common/utility').isEmptyObject;

const DatePicker = (() => {
    const date_pickers = {};
    let localizations  = {};

    const init = (options) => {
        hide(options.selector);
        date_pickers[options.selector] = {};

        if (isEmptyObject(localizations)) {
            localizations = {
                monthNames     : localize(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']),
                monthNamesShort: localize(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']),
                dayNames       : localize(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
                dayNamesMin    : localize(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']),
                nextText       : localize('Next'),
                prevText       : localize('Previous'),
            };
        }

        config(options);
        $(window).resize(() => { checkWidth(options.selector); });
    };

    const hide = (selector) => { $(selector).datepicker('destroy').removeAttr('data-picker').off('keydown'); };

    const create = (selector) => {
        let $this;
        const date_picker = date_pickers[selector];
        $(selector).keydown(function (e) {
            if (e.which === 13) {
                $this = $(this);
                e.preventDefault();
                e.stopPropagation();
                if (date_picker.config_data.type === 'date') {
                    $this.datepicker('setDate', $this.val());
                }
                $this.datepicker('hide');
                $this.blur();
                return false;
            }
            return true;
        }).datepicker(date_picker.config_data);

        // Not possible to tell datepicker where to put it's
        // trigger calendar icon on the page, so we remove it
        // from the DOM and use our own one.
        $('button.ui-datepicker-trigger').remove();
    };

    const config = (options) => {
        const selector = options.selector;

        const obj_config = {
            dateFormat : 'dd M, yy',
            changeMonth: true,
            changeYear : true,
            native     : true,   // custom variable to handle showing of native datepicker for field; true by default
            type       : 'date', // custom variable to show diff (duration) or date; date by default
        };

        Object.keys(localizations).forEach((localization) => {
            obj_config[localization] = localizations[localization];
        });

        $.extend(obj_config, options);

        const setDate = (date) => {
            obj_config[date] = typeof options[date] === 'number' ? moment().add(Number(options[date]), 'day').toDate() : options[date];
        };

        if (options.minDate !== undefined) {
            setDate('minDate');
        }

        if (options.maxDate !== undefined) {
            setDate('maxDate');
        }

        let $this;
        obj_config.onSelect = function (date_text) {
            const year          = $('.ui-datepicker-year').val();
            const month         = formatDate(Number($('.ui-datepicker-month').val()), 1);
            const day           = date_text.split(' ')[0];
            const date          = [year, month, day].join('-');
            $this               = $(this);
            const old_value     = $this.attr('data-value');
            const this_selector = `#${$this.attr('id')}`;

            $this.attr('data-value', date);

            const duration = date_pickers[selector].config_data.type === 'diff' ? moment.utc(`${date} 23:59:59`).diff(moment.utc(), 'days') : null;
            $this.val(duration || date_text);
            if (old_value === date) return false;
            $(this_selector).trigger('change', [duration || date_text]);

            if ($this.hasClass('clearable')) {
                clearable($this);
            }

            return true;
        };

        date_pickers[selector].config_data = $.extend({}, obj_config);

        checkWidth(selector);
    };

    const formatDate = (date, add) => padLeft(date + (add || 0), 2, '0');

    const toDate = date => [date.getFullYear(), formatDate(date.getMonth(), 1), formatDate(date.getDate())].join('-');

    const checkWidth = (selector) => {
        const $selector        = $(selector);
        const date_picker_conf = date_pickers[selector].config_data;
        if ($(window).width() < 770) {
            if (!date_picker_conf.native) {
                hide(selector);
                $selector.attr('type', 'number');
                return;
            }
            if (checkInput('date', 'not-a-date') && $selector.attr('data-picker') !== 'native') {
                hide(selector);
                $selector.attr({ type: 'date', 'data-picker': 'native' }).val($selector.attr('data-value')).removeClass('clear');
                if ($selector.attr('readonly')) $selector.attr('data-readonly', 'readonly').removeAttr('readonly');
                if (date_picker_conf.minDate !== undefined) $selector.attr('min', toDate(date_picker_conf.minDate));
                if (date_picker_conf.maxDate !== undefined) $selector.attr('max', toDate(date_picker_conf.maxDate));
                return;
            }
        }
        if (($(window).width() > 769 && $selector.attr('data-picker') !== 'jquery') || ($(window).width() < 770 && !checkInput('date', 'not-a-date'))) {
            const value        = $selector.attr('data-value') || $selector.val();
            const format_value = value && date_picker_conf.type !== 'diff' ? toReadableFormat(moment(value)) : $selector.val();
            $selector.attr({ type: 'text', 'data-picker': 'jquery', 'data-value': value }).removeAttr('min max').val(format_value);
            if ($selector.attr('data-readonly')) $selector.attr('readonly', 'readonly').removeAttr('data-readonly');
            if ($selector.attr('data-value') && $selector.hasClass('clearable') && !$selector.attr('disabled')) {
                clearable($selector);
            }
            create(selector);
        }
    };

    return {
        init,
        hide,
    };
})();

module.exports = DatePicker;
