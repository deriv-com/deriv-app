const Barriers        = require('./barriers');
const updateWarmChart = require('./common').updateWarmChart;
const DigitInfo       = require('./charts/digit_info');
const Defaults        = require('./defaults');
const getActiveTab    = require('./get_active_tab').getActiveTab;
const Purchase        = require('./purchase');
const Tick            = require('./tick');
const TickDisplay     = require('./tick_trade');
const MBDefaults      = require('../mb_trade/mb_defaults');
const MBTick          = require('../mb_trade/mb_tick');
const BinarySocket    = require('../../base/socket');
const State           = require('../../../_common/storage').State;

const GetTicks = (() => {
    let underlying;

    const request = (symbol, req, callback) => {
        underlying = State.get('is_mb_trading') ? MBDefaults.get('underlying') : Defaults.get('underlying');
        if (underlying && req && callback && (underlying !== req.ticks_history || !req.subscribe)) {
            BinarySocket.send(req, { callback });
        } else {
            const sendRequest = () => {
                BinarySocket.send(req || {
                    ticks_history: symbol || underlying,
                    style        : 'ticks',
                    end          : 'latest',
                    count        : 20,
                    subscribe    : 1,
                }, {
                    callback: (response) => {
                        const type = response.msg_type;

                        if (typeof callback === 'function') {
                            callback(response);
                        }

                        if (State.get('is_mb_trading')) {
                            MBTick.processTickStream(response);
                            return;
                        }

                        if (type === 'tick') {
                            processTick(response);
                            if (getActiveTab() === 'tab_last_digit') {
                                DigitInfo.updateChart(response);
                            }
                        } else if (type === 'history') {
                            processHistory(response);
                            if (getActiveTab() === 'tab_last_digit') {
                                DigitInfo.showChart(response.echo_req.ticks_history, response.history.prices);
                            }
                        }
                    },
                });
            };

            if (!req || req.subscribe) {
                BinarySocket.send({ forget_all: ['ticks', 'candles'] }).then(() => {
                    sendRequest();
                });
            } else {
                sendRequest();
            }
        }
    };

    const processTick = (tick) => {
        const symbol = underlying;
        if (tick.echo_req.ticks === symbol || (tick.tick && tick.tick.symbol === symbol)) {
            Tick.details(tick);
            Tick.display();
            TickDisplay.updateChart(tick);
            Purchase.updateSpotList();
            if (!Barriers.isBarrierUpdated()) {
                Barriers.display();
                Barriers.setBarrierUpdate(true);
            }
            updateWarmChart();
        }
    };

    const processHistory = (res) => {
        if (res.history && res.history.times && res.history.prices) {
            for (let i = 0; i < res.history.times.length; i++) {
                Tick.details({
                    tick: {
                        epoch: res.history.times[i],
                        quote: res.history.prices[i],
                    },
                });
            }
        }
    };

    return {
        request,
    };
})();

module.exports = GetTicks;
