const moment               = require('moment');
const DigitTicker          = require('./digit_ticker');
const ViewPopupUI          = require('../user/view_popup/view_popup.ui');
const showLocalTimeOnHover = require('../../base/clock').showLocalTimeOnHover;
const BinarySocket         = require('../../base/socket');
const LoadingSpinner       = require('../../components/loading-spinner');
const addComma             = require('../../../_common/base/currency_base').addComma;
const localize             = require('../../../_common/localize').localize;
const getPropertyValue     = require('../../../_common/utility').getPropertyValue;

const DigitDisplay = (() => {
    let $container,
        contract,
        tick_count,
        spot_times;

    // Subscribe if contract is still ongoing/running.
    const subscribe = (request) => {
        request.end = 'latest';

        if (contract.exit_tick_time) {
            request.end = +contract.exit_tick_time;
            request.count = +contract.tick_count;
            if (+contract.tick_count === 1) {
                request.end += 1; // TODO: API sends the improper response when end and start are the same for 1 tick contracts. remove this block on fix
            }
        } else {
            request.subscribe = 1;
            request.end       = 'latest';
        }
    };

    const init = (id_render, proposal_open_contract) => {
        const calculated_height = (proposal_open_contract.tick_count + 1) * 40;

        tick_count = 1;
        contract   = proposal_open_contract;
        spot_times = [];

        $container = $(`#${id_render}`);
        $container
            .addClass('normal-font')
            .html($('<h5 />', { text: contract.display_name, class: 'center-text' }))
            .append($('<div />', { class: 'gr-8 gr-centered gr-12-m', style: `height: ${calculated_height}px;` })
                .append($('<div />', { class: 'gr-row', id: 'table_digits' })
                    .append($('<strong />', { class: 'gr-3', text: localize('Tick') }))
                    .append($('<strong />', { class: 'gr-3', text: localize('Spot') }))
                    .append($('<strong />', { class: 'gr-6', text: localize('Spot Time (GMT)') }))))
            .append($('<div />', { class: 'digit-ticker invisible', id: 'digit_ticker_container' }));
        LoadingSpinner.show('table_digits');

        DigitTicker.init(
            'digit_ticker_container',
            contract.contract_type,
            contract.shortcode,
            contract.tick_count,
            contract.status
        );

        const request = {
            ticks_history: contract.underlying,
            start        : +contract.entry_tick_time,
        };

        subscribe(request);

        BinarySocket.send(request, { callback: update });
    };

    const updateTable = (spot, time) => {
        if (spot_times.some(item => item.spot === spot && item.time === time)) {
            return;
        }
        if (spot_times.filter(spot_time => spot_time.spot === spot && spot_time.time === time).length !== 0) {
            return;
        }

        spot_times.push({
            spot,
            time,
        });

        const csv_spot = addComma(spot);

        $container
            .find('#table_digits')
            .append($('<p />', { class: 'gr-3', text: tick_count }))
            .append($('<p />', { class: 'gr-3 gray', html: tick_count === contract.tick_count ? `${csv_spot.slice(0, csv_spot.length - 1)}<strong>${csv_spot.substr(-1)}</strong>` : csv_spot }))
            .append($('<p />', { class: 'gr-6 gray digit-spot-time no-underline', text: moment(+time * 1000).utc().format('YYYY-MM-DD HH:mm:ss') }));

        DigitTicker.update(
            tick_count,
            {
                quote: contract.status !== 'open' ? contract.exit_tick : spot,
                epoch: +contract.exit_tick_time || +contract.current_spot_time,
            }
        );
    };

    const update = (response) => {
        if (!$container.is(':visible') || !response || (!response.tick && !response.history)) {
            return;
        }

        if (getPropertyValue(response, ['tick', 'id']) && document.getElementById('sell_content_wrapper')) {
            ViewPopupUI.storeSubscriptionID(response.tick.id);
        }
        LoadingSpinner.hide('table_digits');
        if (response.history) {
            response.history.times.some((time, idx) => {
                if (+time >= +contract.entry_tick_time) {
                    updateTable(response.history.prices[idx], time);
                    tick_count += 1;
                }
                return tick_count > contract.tick_count;
            });
        } else if (response.tick) {
            if (tick_count <= contract.tick_count &&
                +response.tick.epoch >= +contract.entry_tick_time) {
                updateTable(response.tick.quote, response.tick.epoch);
                tick_count += 1;
            }
        }
        showLocalTimeOnHover('.digit-spot-time');
    };

    const end = (proposal_open_contract) => {
        if (proposal_open_contract.status !== 'open') {
            // if there is no exit tick inside proposal open contract, select a fallback from history instead.
            const fallback_exit_tick = spot_times.find(spot => +spot.time === +proposal_open_contract.exit_tick_time);
            DigitTicker.update(proposal_open_contract.tick_count, {
                quote: proposal_open_contract.exit_tick || fallback_exit_tick.spot,
                epoch: +proposal_open_contract.exit_tick_time,
            });
        }
        if (proposal_open_contract.status === 'won') {
            DigitTicker.markAsWon();
            DigitTicker.markDigitAsWon(proposal_open_contract.exit_tick.slice(-1));
        }
        if (proposal_open_contract.status === 'lost') {
            DigitTicker.markAsLost();
            DigitTicker.markDigitAsLost(proposal_open_contract.exit_tick.slice(-1));
        }
    };

    return {
        end,
        init,
        update,
    };
})();

module.exports = DigitDisplay;
