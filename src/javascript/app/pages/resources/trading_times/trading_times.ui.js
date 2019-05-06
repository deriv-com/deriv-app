const moment           = require('moment');
const TradingTimes     = require('./trading_times');
const BinarySocket     = require('../../../base/socket');
const Table            = require('../../../common/attach_dom/table');
const DatePicker       = require('../../../components/date_picker');
const Login            = require('../../../../_common/base/login');
const CommonFunctions  = require('../../../../_common/common_functions');
const localize         = require('../../../../_common/localize').localize;
const showLoadingImage = require('../../../../_common/utility').showLoadingImage;
const toISOFormat      = require('../../../../_common/string_util').toISOFormat;

const TradingTimesUI = (() => {
    let $date,
        $container,
        $date_container,
        $date_notice,
        $empty_trading_times,
        columns,
        active_symbols,
        trading_times;

    const onLoad = () => {
        $date                = $('#trading-date');
        $container           = $('#trading-times');
        $date_container      = $('#trading-date-container');
        $date_notice         = $('#trading-date-notice');
        $empty_trading_times = $('#empty-trading-times');

        columns    = ['Asset', 'Opens', 'Closes', 'Settles', 'UpcomingEvents'];
        active_symbols = trading_times = undefined;
        $empty_trading_times.setVisibility(0);

        if ($container.contents().length) return;

        showLoadingImage($container[0]);

        if (!trading_times) {
            sendRequest('today', !(active_symbols && active_symbols.length));
        }

        const date = moment.utc();
        const isoFormattedDate = toISOFormat(date);
        $date.attr('data-value', isoFormattedDate);
        DatePicker.init({
            selector: '#trading-date',
            minDate : 0,
            maxDate : 364,
        });
        $date.val(localize('Today'));
        if ($(window).width() < 480) {
            // Create a label to be friendlier
            const $label = $('label[for=trading-date]');
            $label.append($('<span/>', { class: 'ux-date foot-note' }));
            if (!$date.val()) {
                $('span.ux-date').text(localize('Today'));
                $date.val(isoFormattedDate);
                $date.attr('value', isoFormattedDate);
            }
            $date.change(() => {
                const diffInDays = moment().diff(moment($date.val()), 'days', true);
                if (diffInDays < 0 || diffInDays >= 1) {
                    $('span.ux-date').text('');
                } else {
                    $('span.ux-date').text('Today');
                }
            });
        }
        $date.change(function () {
            if (!CommonFunctions.dateValueChanged(this, 'date')) {
                return false;
            }
            $container.empty();
            showLoadingImage($container[0]);
            trading_times = null;
            sendRequest($date.attr('data-value'), !active_symbols);
            return true;
        });

        $container.tabs();
    };

    const populateTable = () => {
        if (!active_symbols || !trading_times) return;
        if (!active_symbols.length) {
            $container.empty();
            $date_container.setVisibility(0);
            $date_notice.setVisibility(0);
            $empty_trading_times.setVisibility(1);
            const empty_trading_times_btn_login = CommonFunctions.getElementById('empty-trading-times-btn-login');
            empty_trading_times_btn_login.removeEventListener('click', loginOnClick);
            empty_trading_times_btn_login.addEventListener('click', loginOnClick);
            return;
        }

        $date_container.setVisibility(1);
        $date_notice.setVisibility(1);

        $('#errorMsg').setVisibility(0);

        const markets = trading_times.markets;

        const $ul       = $('<ul/>');
        const $contents = $('<div/>');

        for (let m = 0; m < markets.length; m++) {
            const tab_id = `market_${(m + 1)}`;

            // contents
            const $market = $('<div/>', { id: tab_id });
            $market.append(createMarketTables(markets[m]));
            if ($market.find('table tr').length) {
                $contents.append($market);

                // tabs
                $ul.append($('<li/>').append($('<a/>', { href: `#${tab_id}`, text: markets[m].name, id: 'outline' })));
            }
        }

        $container.empty().append($ul).append($contents.children());

        if ($container.is(':ui-tabs')) {
            $container.tabs('destroy');
        }
        $container.tabs();
    };

    const createMarketTables = (market) => {
        const $market_tables = $('<div/>');

        // submarkets of this market
        const submarkets = market.submarkets;
        let should_populate;
        for (let s = 0; s < submarkets.length; s++) {
            should_populate = true;
            if (should_populate) {
                // submarket table
                const $submarket_table = createEmptyTable(`${market.name}-${s}`);

                // submarket name
                $submarket_table.find('thead').prepend(createSubmarketHeader(submarkets[s].name))
                    .find('th.opens, th.closes').addClass('nowrap');

                // symbols of this submarket
                const symbols = submarkets[s].symbols;
                for (let sy = 0; sy < symbols.length; sy++) {
                    if (Object.keys(TradingTimes.getSymbolInfo(symbols[sy].symbol, active_symbols)).length !== 0) {
                        $submarket_table.find('tbody').append(createSubmarketTableRow(market.name, submarkets[s].name, symbols[sy]));
                    }
                }

                if ($submarket_table.find('tbody tr').length) {
                    $market_tables.append($submarket_table);
                }
            }
        }

        return $market_tables;
    };

    const createSubmarketHeader = submarket_name => (
        $('<tr/>', { class: 'flex-tr' })
            .append($('<th/>', { class: 'flex-tr-child submarket-name', colspan: columns.length, text: submarket_name })));

    const createSubmarketTableRow = (market_name, submarket_name, symbol) => {
        const $table_row = Table.createFlexTableRow(
            [
                symbol.name,
                '', // Opens
                '', // Closes
                symbol.times.settlement,
                '',  // UpcomingEvents
            ],
            columns,
            'data');
        $table_row.children('.opens').html(symbol.times.open.join('<br />'));
        $table_row.children('.closes').html(symbol.times.close.join('<br />'));
        $table_row.children('.upcomingevents').html(createEventsText(symbol.events));

        return $table_row;
    };

    const createEventsText = (events) => {
        let result = '';
        for (let i = 0; i < events.length; i++) {
            result += `${(i > 0 ? '<br />' : '')}${localize(events[i].descrip /* localize-ignore */)}: ${localize(events[i].dates /* localize-ignore */)}`; // handled in static_strings_app.js
        }
        return result.length > 0 ? result : '--';
    };

    const createEmptyTable = (table_id) => {
        const header = [
            localize('Asset'),
            localize('Opens'),
            localize('Closes'),
            localize('Settles'),
            localize('Upcoming Events'),
        ];

        const metadata = {
            id  : table_id,
            cols: columns,
        };

        return Table.createFlexTable([], metadata, header);
    };

    const sendRequest = (date, should_request_active_symbols) => {
        const req = { active_symbols: 'brief' };
        if (should_request_active_symbols) {
            BinarySocket.wait('authorize').then(() => {
                BinarySocket.send(req, { msg_type: 'active_symbols' }).then((response) => {
                    TradingTimesUI.setActiveSymbols(response);
                });
            });
        }
        BinarySocket.send({ trading_times: date || 'today' }).then((response) => {
            trading_times = response.trading_times;
            if (active_symbols) populateTable();
        });
    };

    const loginOnClick = (e) => {
        e.preventDefault();
        Login.redirectToLogin();
    };

    return {
        onLoad,
        setActiveSymbols: (response) => {
            active_symbols = response.active_symbols.slice(0); // clone
            if (trading_times) populateTable();
        },
    };
})();

module.exports = TradingTimesUI;
