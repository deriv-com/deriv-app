import { getLast } from 'binary-utils';
import { localize } from '@deriv/translations';
import * as constants from './state/constants';
import { getDirection, getLastDigit } from '../utils/helpers';
import { expectPositiveInteger } from '../utils/sanitize';
import { observer as globalObserver } from '../../../utils/observer';
import { api_base } from '../../api/api-base';

let tickListenerKey;

export default Engine =>
    class Ticks extends Engine {
        async watchTicks(symbol) {
            if (symbol && this.symbol !== symbol) {
                this.symbol = symbol;
                const { ticksService } = this.$scope;

                await ticksService.stopMonitor({
                    symbol,
                    key: tickListenerKey,
                });
                const callback = ticks => {
                    if (this.is_proposal_subscription_required) {
                        this.checkProposalReady();
                    }
                    const lastTick = ticks.slice(-1)[0];
                    const { epoch } = lastTick;
                    this.store.dispatch({ type: constants.NEW_TICK, payload: epoch });
                };

                const key = await ticksService.monitor({ symbol, callback });
                tickListenerKey = key;
            }
        }

        checkTicksPromiseExists() {
            return this.$scope.ticksService.ticks_history_promise;
        }

        getTicks(toString = false) {
            return new Promise(resolve => {
                this.$scope.ticksService.request({ symbol: this.symbol }).then(ticks => {
                    const ticks_list = ticks.map(tick => {
                        if (toString) {
                            return tick.quote.toFixed(this.getPipSize());
                        }
                        return tick.quote;
                    });

                    resolve(ticks_list);
                });
            });
        }

        getLastTick(raw, toString = false) {
            return new Promise(resolve =>
                this.$scope.ticksService
                    .request({ symbol: this.symbol })
                    .then(ticks => {
                        let last_tick = raw ? getLast(ticks) : getLast(ticks).quote;
                        if (!raw && toString) {
                            last_tick = last_tick.toFixed(this.getPipSize());
                        }
                        resolve(last_tick);
                    })
                    .catch(e => {
                        if (e.code === 'MarketIsClosed') {
                            globalObserver.emit('Error', e);
                            resolve(e.code);
                        }
                    })
            );
        }

        async fetchStatData() {
            try {
                if (!this.subscription) {
                    const request = window?.Blockly?.selected_accumlators_amount;
                    api_base?.api?.send({ request });
                }
                const response = await api_base?.api?.expectResponse('proposal');
                try {
                    this.subscription = response?.proposal.subscription_id;
                    return response?.proposal.contract_details?.ticks_stayed_in?.reverse();
                } catch (error) {
                    throw new Error('Unexpected message type or no proposal found');
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Error fetching stat data:', error);
                throw error;
            }
        }

        async getStatList() {
            try {
                const ticksStayedIn = await this.fetchStatData();
                return ticksStayedIn;
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log('Error fetching current stat:', error);
            }
        }

        async getCurrentStat() {
            try {
                const ticks_stayed_in = await this.fetchStatData();
                return ticks_stayed_in?.[ticks_stayed_in?.length - 1];
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log('Error fetching current stat:', error);
            }
        }

        async getDelayTickValue(tick_value) {
            return new Promise((resolve, reject) => {
                try {
                    const ticks = [];
                    const symbol = this.symbol;

                    const callback = ticksList => {
                        ticks.push(ticksList);
                        if (ticks.length === tick_value) {
                            this.$scope.ticksService.stopMonitor({
                                symbol,
                                key: '',
                            });
                            resolve(ticks);
                            ticks.length = 0;
                        }
                    };
                    this.$scope.ticksService.monitor({ symbol, callback });
                } catch (error) {
                    reject(new Error(`Failed to start tick monitoring: ${error.message}`));
                }
            });
        }

        getLastDigit() {
            return new Promise(resolve => this.getLastTick(false, true).then(tick => resolve(getLastDigit(tick))));
        }

        getLastDigitList() {
            return new Promise(resolve => this.getTicks().then(ticks => resolve(this.getLastDigitsFromList(ticks))));
        }
        getLastDigitsFromList(ticks) {
            const digits = ticks.map(tick => {
                return getLastDigit(tick.toFixed(this.getPipSize()));
            });
            return digits;
        }

        checkDirection(dir) {
            return new Promise(resolve =>
                this.$scope.ticksService
                    .request({ symbol: this.symbol })
                    .then(ticks => resolve(getDirection(ticks) === dir))
            );
        }

        getOhlc(args) {
            const { granularity = this.options.candleInterval || 60, field } = args || {};

            return new Promise(resolve =>
                this.$scope.ticksService
                    .request({ symbol: this.symbol, granularity })
                    .then(ohlc => resolve(field ? ohlc.map(o => o[field]) : ohlc))
            );
        }

        getOhlcFromEnd(args) {
            const { index: i = 1 } = args || {};

            const index = expectPositiveInteger(Number(i), localize('Index must be a positive integer'));

            return new Promise(resolve => this.getOhlc(args).then(ohlc => resolve(ohlc.slice(-index)[0])));
        }

        getPipSize() {
            return this.$scope.ticksService.pipSizes[this.symbol];
        }
    };
