const MBDefaults       = require('./mb_defaults');
const MBNotifications  = require('./mb_notifications');
const BinarySocket     = require('../../base/socket');
const getElementById   = require('../../../_common/common_functions').getElementById;
const getPropertyValue = require('../../../_common/utility').getPropertyValue;

/*
 * MBTick object handles all the process/display related to tick streaming
 *
 * We request tick stream for particular underlying to update current spot
 *
 *
 * Usage:
 * use `MBTick.detail` to populate this object
 *
 * then use
 *
 * `MBTick.quote()` to get current spot quote
 * 'MBTick.display()` to display current spot
 */

const MBTick = (() => {
    let quote         = '';
    let error_message = '';

    const details = (data) => {
        error_message = '';

        if (data) {
            if (data.error) {
                error_message = data.error.message;
            } else {
                quote = data.tick.quote;
            }
        }
    };

    const display = () => {
        $('#spot').fadeIn(200);
        let message = '';
        if (error_message) {
            message = error_message;
        } else {
            message = quote;
        }

        const spot_element = getElementById('spot');
        if (parseFloat(message) !== +message) {
            spot_element.className = 'error';
        } else {
            spot_element.classList.remove('error');
            displayPriceMovement(parseFloat(spot_element.textContent), parseFloat(message));
        }

        spot_element.textContent = message;
    };

    /*
     * Display price/spot movement variation to depict price moved up or down
     */
    const displayPriceMovement = (old_value, current_value) => {
        let class_name = 'still';
        if (old_value !== current_value) {
            class_name = current_value > old_value ? 'up' : 'down';
        }
        const $spot = $('#spot');
        $spot.removeClass('up down still').addClass(class_name);
    };

    const request = (symbol) => {
        BinarySocket.send({
            ticks    : symbol,
            subscribe: 1,
        }, { callback: processTickStream });
    };

    const processTickStream = (response) => {
        if (response.msg_type === 'tick' && MBDefaults.get('underlying') === (response.echo_req.ticks || response.echo_req.ticks_history)) {
            if (getPropertyValue(response, 'error')) {
                MBNotifications.show({ localized_text: response.error.message, uid: 'TICK_ERROR' });
                return;
            }

            details(response);
            display();
        }
    };

    return {
        details,
        display,
        request,
        displayPriceMovement,
        processTickStream,
        quote       : () => quote,
        errorMessage: () => error_message,
        setQuote    : (q) => { quote = q; },
        clean       : () => {
            quote       = '';
            const $spot = $('#spot');
            $spot.fadeOut(200, () => {
                // resets spot movement coloring, will continue on the next tick responses
                $spot.removeClass('up down').text('');
            });
        },
    };
})();

module.exports = MBTick;
