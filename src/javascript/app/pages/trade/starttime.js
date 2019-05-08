const Dropdown          = require('@binary-com/binary-style').selectDropdown;
const moment            = require('moment');
const CommonIndependent = require('./common_independent');
const Contract          = require('./contract');
const Defaults          = require('./defaults');
const Durations         = require('./duration');
const getElementById    = require('../../../_common/common_functions').getElementById;
const localize          = require('../../../_common/localize').localize;
const State             = require('../../../_common/storage').State;
const createElement     = require('../../../_common/utility').createElement;

/*
 * Handles start time display
 *
 * It process `Contract.startDates` in case of forward
 * starting contracts and populate the start time select
 * box
 */

const StartDates = (() => {
    let has_now = 0;
    State.remove('is_start_dates_displayed');

    const compareStartDate = (a, b) => {
        let sort = 0;
        if (a.date !== b.date) {
            sort = a.date > b.date ? 1 : -1;
        }
        return sort;
    };

    const displayStartDates = () => {
        const start_dates = Contract.startDates();

        if (start_dates && start_dates.list && start_dates.list.length) {
            const target   = CommonIndependent.getStartDateNode();
            const fragment = document.createDocumentFragment();
            let option,
                first,
                selected,
                day,
                $duplicated_option;

            getElementById('date_start_row').style.display = 'flex';

            while (target && target.firstChild) {
                target.removeChild(target.firstChild);
            }

            if (start_dates.has_spot) {
                option = createElement('option', { value: 'now', text: localize('Now') });
                fragment.appendChild(option);
                has_now = 1;
            } else {
                has_now = 0;
            }

            start_dates.list.sort(compareStartDate);
            const default_start = Defaults.get('date_start') || 'now';

            const rounding = 5 * 60 * 1000;
            const now      = moment.utc();
            start_dates.list.forEach((start_date) => {
                let date_open    = moment.unix(start_date.open).utc();
                const date_close = moment.unix(start_date.close).utc();

                if (date_close.isAfter(now)) {
                    if (now.isAfter(date_open)) {
                        date_open = now;
                    }

                    date_open          = moment.utc(Math.ceil((+date_open) / rounding) * rounding);
                    day                = date_open.format('ddd - DD MMM, YYYY');
                    $duplicated_option = $(fragment).find(`option:contains(${day})`);
                    if ($duplicated_option.length) {
                        if (+date_close.unix() > +$duplicated_option.attr('data-end')) {
                            $duplicated_option.attr('data-end', date_close.unix());
                        }
                    } else {
                        option = createElement('option', { value: date_open.unix(), 'data-end': date_close.unix(), text: day });
                        if (option.value >= default_start && !selected) {
                            selected = true;
                            option.setAttribute('selected', 'selected');
                        }
                        if (typeof first === 'undefined' && !has_now) {
                            first = date_open.unix();
                        }
                        fragment.appendChild(option);
                    }
                }
            });
            if (target) {
                target.appendChild(fragment);
                Dropdown('#date_start');
                Defaults.set('date_start', target.value);
                $('#time_start_row').setVisibility(target.value !== 'now');
            }
            State.set('is_start_dates_displayed', true);
            if (first) {
                Durations.onStartDateChange(first);
            }
        } else {
            if (start_dates && start_dates.has_spot) {
                const now_option = createElement('option', { value: 'now', text: localize('Now') });
                CommonIndependent.getStartDateNode().appendChild(now_option);
                has_now = 1;
            }
            State.remove('is_start_dates_displayed');
            getElementById('date_start_row').style.display = 'none';
            getElementById('date_start').value = 'now';
            Defaults.remove('date_start');
        }
    };

    return {
        display: displayStartDates,
        disable: () => { CommonIndependent.getStartDateNode().setAttribute('disabled', 'disabled'); },
        enable : () => { CommonIndependent.getStartDateNode().removeAttribute('disabled'); },
    };
})();

module.exports = {
    StartDates,
};
