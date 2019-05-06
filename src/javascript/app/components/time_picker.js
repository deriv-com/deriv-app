const moment     = require('moment');
const checkInput = require('../../_common/common_functions').checkInput;
const localize   = require('../../_common/localize').localize;
const padLeft    = require('../../_common/string_util').padLeft;
const clearable  = require('../../_common/utility').clearable;

const TimePicker = (() => {
    const time_pickers = {};

    const init = (options) => {
        removeJqueryPicker(options.selector, options.datepickerDate);
        time_pickers[options.selector] = {};

        makeConfig(options);
        updatePicker(options.selector);
        $(window).resize(() => { updatePicker(options.selector); });
    };

    const makeConfig = (options) => {
        let time_now = moment.utc(window.time).clone();

        const obj_config = {
            hourText  : localize('Hour'),
            minuteText: localize('Minute'),
            amPmText  : localize(['AM', 'PM']),
        };

        if (options.minTime) {
            options.minTime = options.minTime === 'now' ? time_now : moment.utc(options.minTime);
            if (options.minTime.isBefore(time_now) &&
                (!options.maxTime || time_now.unix() !== options.maxTime.unix())) {
                options.minTime = time_now;
            }
            if (options.useLocalTime) options.minTime = options.minTime.local();

            // disable hour without minute options (55 min is the last option)
            if (options.minTime.minutes() > 55) {
                options.minTime.minutes(60);
            }
            obj_config.minTime = { hour: parseInt(options.minTime.hour()), minute: parseInt(options.minTime.minute()) };
        }

        if (options.maxTime) {
            options.maxTime = moment.utc(options.maxTime);
            let minute      = parseInt(options.maxTime.minute());
            let hour        = parseInt(options.maxTime.hour());

            if (!(hour === 0 && minute === 0) && !(hour === 23 && minute === 55)) {
                hour   = minute < 5 ? hour - 1 : hour;
                minute = minute < 5 ? 55 : Math.ceil((minute - 5) / 5) * 5;
            }

            obj_config.maxTime = { hour, minute };
        }

        let $this;
        obj_config.onSelect = function (time) {
            $this               = $(this);
            const this_selector = `#${$this.attr('id')}`;
            const old_value     = $(this_selector).attr('data-value');

            if (old_value && old_value === time) return false;

            let new_time;
            if (!time.match(/^(:?[0-3]\d):(:?[0-5]\d):(:?[0-5]\d)$/)) {
                time_now      = window.time.clone();
                const invalid = time.match(/([a-z0-9]*):([a-z0-9]*):?([a-z0-9]*)?/);
                let hour      = time_now.format('hh');
                let minute    = time_now.format('mm');
                let second    = time_now.format('ss');

                if (typeof invalid[1] !== 'undefined' && isFinite(invalid[1])) hour = formatTime(invalid[1]);
                if (typeof invalid[2] !== 'undefined' && isFinite(invalid[2])) minute = formatTime(invalid[2]);
                if (typeof invalid[3] !== 'undefined' && isFinite(invalid[3])) second = formatTime(invalid[3]);

                new_time = moment(`${time_now.format('YYYY-MM-DD')} ${[hour, minute, second].join(':')}`).format('HH:mm');

                if (old_value && old_value === new_time) return false;
                $this.val(new_time);
            }
            $this.attr('data-value', new_time || time);

            if ($this.hasClass('clearable')) {
                clearable($this);
            }

            $(this_selector).trigger('change', [new_time || time]);

            return true;
        };

        time_pickers[options.selector].config_data = obj_config;
    };

    const formatTime = time => padLeft(time, 2, '0');

    const toTime = time => [formatTime(time.hour), formatTime(time.minute), '00'].join(':');

    const removeJqueryPicker = (selector, datepickerDate) => {
        $(selector).timepicker('destroy').removeAttr('data-picker').off('keydown keyup input');
        if (!datepickerDate) return;
        if (!moment().isBefore(moment(datepickerDate))) {
            $(selector).attr('data-value', '').val('');
        }
    };

    const addJqueryPicker = (selector) => {
        let $this;
        $(selector).keydown(function (e) {
            if (e.which === 13) {
                $this = $(this);
                e.preventDefault();
                e.stopPropagation();
                $this.timepicker('setTime', $this.val());
                $this.timepicker('hide');
                $this.blur();
                return false;
            }
            return true;
        }).timepicker(time_pickers[selector].config_data);
    };

    const updatePicker = (selector) => {
        const $selector        = $(selector);
        const time_picker_conf = time_pickers[selector].config_data;
        if ($(window).width() < 770 && checkInput('time', 'not-a-time') && $selector.attr('data-picker') !== 'native') {
            removeJqueryPicker(selector);
            $selector.attr({ type: 'time', 'data-picker': 'native' }).val($selector.attr('data-value')).removeAttr('readonly').removeClass('clear');

            const minTime = time_picker_conf.minTime;
            if (minTime) $selector.attr('min', toTime(minTime));

            const maxTime = time_picker_conf.maxTime;
            if (maxTime) $selector.attr('max', toTime(maxTime));
            return;
        }
        if (($(window).width() > 769 && $selector.attr('data-picker') !== 'jquery') || ($(window).width() < 770 && !checkInput('time', 'not-a-time'))) {
            $selector.attr({ type: 'text', 'data-picker': 'jquery', readonly: 'readonly' });
            $selector.removeAttr('min max');
            if ($selector.attr('data-value') && $selector.hasClass('clearable') && !$selector.attr('disabled')) {
                clearable($selector);
            }
            addJqueryPicker(selector);
        }
    };

    return {
        init,
    };
})();

module.exports = TimePicker;
