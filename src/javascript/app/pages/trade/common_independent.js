const moment           = require('moment');
const getElementById   = require('../../../_common/common_functions').getElementById;
const getPropertyValue = require('../../../_common/utility').getPropertyValue;

/*
 * Display price/spot movement variation to depict price moved up or down
 */
const displayPriceMovement = (element, old_value, current_value) => {
    element.classList.remove('price_moved_down');
    element.classList.remove('price_moved_up');
    if (parseFloat(current_value) > parseFloat(old_value)) {
        element.classList.remove('price_moved_down');
        element.classList.add('price_moved_up');
    } else if (parseFloat(current_value) < parseFloat(old_value)) {
        element.classList.remove('price_moved_up');
        element.classList.add('price_moved_down');
    }
};

/*
 * count number of decimal places in spot so that we can make barrier to same decimal places
 */
const countDecimalPlaces = (num) => {
    if (!isNaN(num)) {
        const str = num.toString();
        if (str.indexOf('.') !== -1) {
            return str.split('.')[1].length;
        }
    }
    return 0;
};

const trading_times = {};

const processTradingTimesAnswer = (response) => {
    if (!getPropertyValue(trading_times, response.echo_req.trading_times) && getPropertyValue(response, ['trading_times', 'markets'])) {
        for (let i = 0; i < response.trading_times.markets.length; i++) {
            const submarkets = response.trading_times.markets[i].submarkets;
            if (submarkets) {
                for (let j = 0; j < submarkets.length; j++) {
                    const symbols = submarkets[j].symbols;
                    if (symbols) {
                        for (let k = 0; k < symbols.length; k++) {
                            const symbol = symbols[k];
                            if (!trading_times[response.echo_req.trading_times]) {
                                trading_times[response.echo_req.trading_times] = {};
                            }
                            trading_times[response.echo_req.trading_times][symbol.symbol] = symbol.times.close;
                        }
                    }
                }
            }
        }
    }
};

const getElement = () => getElementById('date_start');

const checkValidTime = (time_start_element = getElementById('time_start'), $date_start = $('#date_start'), time = time_start_element.value) => {
    let time_array = '';
    if (time) {
        time_array = time.split(':');
    }
    const now_time           = moment.utc();
    const hour               = time_array.length ? +time_array[0] : now_time.hour();
    const minute             = time_array.length ? +time_array[1] : now_time.minute();
    const date_time          = moment.utc(getElement().value * 1000).hour(hour).minute(minute);
    const min_max_time       = getMinMaxTimeStart($date_start);
    let min_time             = min_max_time.minTime.clone();
    if (!(min_max_time.minTime.format('HH:mm') === '23:55')) {
        min_time = min_time.add(5, 'minutes');
    }
    time_start_element.value = date_time.isBefore(min_time) || date_time.isAfter(min_max_time.maxTime) || !time ? min_time.format('HH:mm') : time_array.join(':');
    time_start_element.setAttribute('data-value', time_start_element.value);
};

const getMinMaxTimeStart = ($min_max_selector = $('#date_start'), moment_now = (window.time || moment.utc()).clone()) => {
    const $selected_option = getSelectedOption($min_max_selector);
    const start_date       = moment.unix($min_max_selector.val()).utc();
    const end_date         = moment.unix($selected_option.attr('data-end')).utc();
    return {
        minTime: start_date.isAfter(moment_now) ? start_date : moment_now.clone(),
        maxTime: end_date.isSame(start_date, 'day') ? end_date : start_date.clone().hour(23).minute(55).second(0),
    };
};

const getMinMaxTimeEnd = ($date_start = $('#date_start'), $time_start = $('#time_start'), moment_now = (window.time || moment.utc()).clone(), $expiry_time = $('#expiry_time'), $expiry_date = $('#expiry_date')) => {
    let min_time,
        max_time;
    const date_start_val = $date_start.val();
    if (date_start_val === 'now') {
        const min_max_time = getMinMaxTimeStart();
        min_time = min_max_time.minTime.clone().add(1, 'minute'); // round up seconds (previously 9:05 endtime was available, when time is 9:05:12)
        max_time = min_max_time.maxTime;
    } else {
        const expiry_time_val = $expiry_time.val().split(':');
        let end_time          = moment.utc($expiry_date.attr('data-value'));
        if (expiry_time_val.length > 1) {
            end_time = end_time.hour(expiry_time_val[0]).minute(expiry_time_val[1]);
        }
        const moment_date_start = moment.unix(date_start_val).utc();
        const start_time_val    = $time_start.val().split(':');
        const compare           = isNaN(+date_start_val) ? moment_now.clone() :
            moment_date_start.hour(start_time_val[0]).minute(start_time_val[1]);
        // if expiry time is one day after start time, minTime can be 0
        // but maxTime should be 24 hours after start time, so exact value of start time
        if (end_time.isAfter(compare, 'day')) {
            min_time = 0;
            max_time = start_time_val.length > 1 ?
                end_time.clone().hour(start_time_val[0]).minute(start_time_val[1]) : end_time.clone();
        } else {
            // if expiry time is same as today, min time should be the selected start time plus five minutes
            min_time = moment_date_start.clone();
            min_time = min_time.hour(start_time_val[0]).minute(start_time_val[1]);
            if (!(+start_time_val[0] === 23 && +start_time_val[1] === 55)) {
                min_time = min_time.add(5, 'minutes');
            }
            max_time = getMinMaxTimeStart().maxTime;
        }
    }
    return {
        minTime: min_time,
        maxTime: max_time,
    };
};

const getSelectedOption = ($selector) => {
    let $selected_option = $selector.find('option:selected');
    // if 'now' is selected, take first option's value
    if (isNaN(+$selector.val())) {
        $selected_option = $($selector.find('option')[1]);
    }
    return $selected_option;
};

module.exports = {
    displayPriceMovement,
    countDecimalPlaces,
    processTradingTimesAnswer,
    checkValidTime,
    getSelectedOption,
    getMinMaxTimeStart,
    getMinMaxTimeEnd,
    getStartDateNode: getElement,
    getTradingTimes : () => trading_times,
};
