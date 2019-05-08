const moment               = require('moment');
const countDecimalPlaces   = require('./common_independent').countDecimalPlaces;
const displayPriceMovement = require('./common_independent').displayPriceMovement;
const addComma             = require('../../../_common/base/currency_base').addComma;
const elementTextContent   = require('../../../_common/common_functions').elementTextContent;
const getElementById       = require('../../../_common/common_functions').getElementById;
const isVisible            = require('../../../_common/common_functions').isVisible;

/*
 * Tick object handles all the process/display related to tick streaming
 *
 * We request tick stream for particular underlying to update current spot
 *
 *
 * Usage:
 * use `Tick.detail` to populate this object
 *
 * then use
 *
 * `Tick.quote()` to get current spot quote
 * `Tick.id()` to get the unique for current stream
 * `Tick.epoch()` to get the tick epoch time
 * 'Tick.display()` to display current spot
 */
const Tick = (() => {
    let quote         = '';
    let id            = '';
    let epoch         = '';
    let error_message = '';
    let spots         = {};

    const details = (data) => {
        error_message = '';

        if (data) {
            if (data.error) {
                error_message = data.error.message;
            } else {
                const tick = data.tick;
                quote      = tick.quote;
                id         = tick.id;
                epoch      = tick.epoch;

                spots[epoch]  = quote;
                const epoches = Object.keys(spots).sort((a, b) => a - b);
                if (epoches.length > 20) {
                    delete spots[epoches[0]];
                }
            }
        }
    };

    const display = () => {
        $('#spot').fadeIn(200);
        let message = '';
        let message_number = '';
        if (error_message) {
            message = error_message;
            message_number = error_message;
        } else {
            const decimal_places = parseInt(countDecimalPlaces(Tick.quote()));
            message = addComma(quote, decimal_places);
            message_number = quote;
        }

        const spot_element = getElementById('spot');
        if (parseFloat(message_number) !== +message_number) {
            spot_element.className = 'error';
        } else {
            spot_element.classList.remove('error');
            displayPriceMovement(spot_element, spot_element.getAttribute('data-value'), message_number);
            displayIndicativeBarrier();
        }

        spot_element.setAttribute('data-value', message_number);
        elementTextContent(spot_element, message);
    };

    /*
     * display indicative barrier
     */
    const displayIndicativeBarrier = () => {
        const current_tick = Tick.quote();

        const unit                            = getElementById('duration_units');
        const indicative_barrier_tooltip      = getElementById('indicative_barrier_tooltip');
        const indicative_high_barrier_tooltip = getElementById('indicative_high_barrier_tooltip');
        const indicative_low_barrier_tooltip  = getElementById('indicative_low_barrier_tooltip');
        const barrier_element                 = getElementById('barrier');
        const high_barrier_element            = getElementById('barrier_high');
        const low_barrier_element             = getElementById('barrier_low');
        const tooltip                         = getElementById('barrier_tooltip');
        const span                            = getElementById('barrier_span');
        const high_tooltip                    = getElementById('barrier_high_tooltip');
        const high_span                       = getElementById('barrier_high_span');
        const low_tooltip                     = getElementById('barrier_low_tooltip');
        const low_span                        = getElementById('barrier_low_span');

        let value;

        const end_time = getElementById('expiry_date');
        if (unit && (!isVisible(unit) || unit.value !== 'd') && current_tick && !isNaN(current_tick) &&
            (end_time && (!isVisible(end_time) || moment(end_time.getAttribute('data-value')).isBefore(moment().add(1, 'day'), 'day')))) {
            const decimal_places = countDecimalPlaces(current_tick);
            if (isVisible(indicative_barrier_tooltip) && String(barrier_element.value).match(/^[+-]/)) {
                const barrier_value = isNaN(parseFloat(barrier_element.value)) ? 0 : parseFloat(barrier_element.value);

                indicative_barrier_tooltip.textContent =
                    (parseFloat(current_tick) + barrier_value).toFixed(decimal_places);
                tooltip.style.display = 'inherit';
                span.style.display    = 'none';
            } else {
                elementTextContent(indicative_barrier_tooltip, '');
                tooltip.style.display = 'none';
                span.style.display    = 'inherit';
            }

            if (isVisible(indicative_high_barrier_tooltip) && String(high_barrier_element.value).match(/^[+-]/)) {
                value = parseFloat(high_barrier_element.value);
                value = isNaN(value) ? 0 : value;
                indicative_high_barrier_tooltip.textContent =
                    (parseFloat(current_tick) + value).toFixed(decimal_places);
                high_tooltip.style.display = 'inherit';
                high_span.style.display    = 'none';
            } else {
                elementTextContent(indicative_high_barrier_tooltip, '');
                high_tooltip.style.display = 'none';
                high_span.style.display    = 'inherit';
            }

            if (isVisible(indicative_low_barrier_tooltip) && String(low_barrier_element.value).match(/^[+-]/)) {
                value = parseFloat(low_barrier_element.value);
                value = isNaN(value) ? 0 : value;
                indicative_low_barrier_tooltip.textContent = (parseFloat(current_tick) + value).toFixed(decimal_places);
                low_tooltip.style.display = 'inherit';
                low_span.style.display    = 'none';
            } else {
                elementTextContent(indicative_low_barrier_tooltip, '');
                low_tooltip.style.display = 'none';
                low_span.style.display    = 'inherit';
            }
        } else {
            elementTextContent(indicative_barrier_tooltip, '');
            elementTextContent(indicative_high_barrier_tooltip, '');
            elementTextContent(indicative_low_barrier_tooltip, '');
        }
    };

    const clean = () => {
        spots = {};
        quote = '';
        $('#spot').fadeOut(200, function () {
            // resets spot movement coloring, will continue on the next tick responses
            $(this).removeClass('price_moved_down price_moved_up').text('');
        });
    };

    return {
        details,
        display,
        clean,
        quote       : () => quote,
        id          : () => id,
        epoch       : () => epoch,
        errorMessage: () => error_message,
        spots       : () => spots,
        setQuote    : (q) => { quote = q; },
    };
})();

module.exports = Tick;
