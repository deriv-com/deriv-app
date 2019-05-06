const moment                = require('moment');
const TradingAnalysis       = require('./analysis');
const Barriers              = require('./barriers');
const CommonTrading         = require('./common');
const CommonIndependent     = require('./common_independent');
const Defaults              = require('./defaults');
const Durations             = require('./duration');
const GetTicks              = require('./get_ticks');
const Notifications         = require('./notifications');
const Price                 = require('./price');
const Process               = require('./process');
const Purchase              = require('./purchase');
const Tick                  = require('./tick');
const BinarySocket          = require('../../base/socket');
const getDecimalPlaces      = require('../../common/currency').getDecimalPlaces;
const isCryptocurrency      = require('../../common/currency').isCryptocurrency;
const onlyNumericOnKeypress = require('../../common/event_handler');
const TimePicker            = require('../../components/time_picker');
const GTM                   = require('../../../_common/base/gtm');
const dateValueChanged      = require('../../../_common/common_functions').dateValueChanged;
const isVisible             = require('../../../_common/common_functions').isVisible;
const getElementById        = require('../../../_common/common_functions').getElementById;
const localize              = require('../../../_common/localize').localize;

/*
 * TradingEvents object contains all the event handler function for
 * websocket trading page
 *
 * We need it as object so that we can call TradingEvent.init() only on trading
 * page for pjax to work else it will fire on all pages
 *
 */
const TradingEvents = (() => {
    const initiate = () => {
        const attachTimePicker = (selector, check_end_time) => {
            let min_time,
                max_time;
            if ($date_start && $date_start.val()) {
                const date_start_val    = $date_start.val();
                const moment_date_start = moment.unix(date_start_val).utc();
                const moment_now        = (window.time || moment.utc()).clone();

                if (check_end_time) {
                    const min_max_time = CommonIndependent.getMinMaxTimeEnd($date_start, $time_start, moment_now);

                    min_time = min_max_time.minTime;
                    max_time = min_max_time.maxTime;
                } else if (moment_date_start.isSame(moment_now, 'day')) {
                    // for start time picker only disable past times of today
                    min_time = moment_now.clone();
                }
            }
            const initObj = { selector };
            if (min_time) {
                initObj.minTime = min_time.clone();
            }
            if (max_time) {
                initObj.maxTime = max_time.clone();
            }
            TimePicker.init(initObj);
        };

        const contract_input = getElementById('contract');
        contract_input.addEventListener('change', () => {
            /*
             * attach event to form list, so when client click on different form we need to update form
             * and request for new Contract details to populate the form and request price accordingly
             */
            Process.processContractForm();
            TradingAnalysis.request();
        });

        const el_equal = getElementById('callputequal');
        el_equal.addEventListener('change', (e) => {
            Defaults.set('is_equal', +e.target.checked);
            Process.processContractForm();
            TradingAnalysis.request();
        });

        /*
         * attach event to underlying change, event need to request new contract details and price
         */
        getElementById('underlying').addEventListener('change', (e) => {
            if (e.target) {
                CommonTrading.showFormOverlay();
                CommonTrading.showPriceOverlay();
                const underlying = e.target.value;
                Defaults.remove('barrier', 'barrier_high', 'barrier_low');
                Defaults.set('underlying', underlying);

                Tick.clean();

                CommonTrading.updateWarmChart();

                getContracts(underlying);

                // get ticks for current underlying
                GetTicks.request(underlying);

                CommonTrading.displayTooltip();
            }
        });

        const getContracts = (underlying) => {
            BinarySocket.send({ contracts_for: underlying }).then((response) => {
                Notifications.hide('CONNECTION_ERROR');
                Process.processContract(response);
            });
        };

        /*
         * bind event to change in duration amount, request new price
         */
        const triggerOnDurationChange = (e) => {
            if (e.target.value % 1 !== 0) {
                e.target.value = Math.floor(e.target.value);
            }
            Defaults.set('duration_amount', e.target.value);
            Durations.selectAmount(e.target.value);
            Price.processPriceRequest();
            CommonTrading.submitForm(getElementById('websocket_form'));
        };
        const duration_amount_element = getElementById('duration_amount');
        let input_event_triggered     = false;          // For triggering one of the two events.
        if (duration_amount_element) {
            duration_amount_element.addEventListener('keypress', onlyNumericOnKeypress);
            // jquery needed for datepicker
            $('#duration_amount')
                .on('input', CommonTrading.debounce((e) => {
                    triggerOnDurationChange(e);
                    Durations.validateMinDurationAmount();
                    input_event_triggered = true;
                }))
                .on('change', CommonTrading.debounce((e) => {
                    // using Defaults, to update the value by datepicker if it was emptied by keyboard (delete)
                    Durations.validateMinDurationAmount();
                    if (input_event_triggered === false || !Defaults.get('duration_amount')) {
                        triggerOnDurationChange(e);
                    } else {
                        input_event_triggered = false;
                    }
                }));
        }

        /*
         * attach event to expiry time change, event need to populate duration
         * and request new price
         */
        getElementById('expiry_type').addEventListener('change', (e) => {
            Defaults.set('expiry_type', e.target.value);
            if (Process.onExpiryTypeChange(e.target.value)) Price.processPriceRequest();
        });

        /*
         * bind event to change in duration units, populate duration and request price
         */
        getElementById('duration_units').addEventListener('change', (e) => {
            Defaults.remove('barrier', 'barrier_high', 'barrier_low');
            Process.onDurationUnitChange(e.target.value);
            Process.processContractForm();
        });

        /*
         * bind event to change in endtime date and time
         */
        // need to use jquery as datepicker is used, if we switch to some other
        // datepicker we can move back to javascript
        Durations.expiryDateOnChange($('#expiry_date'));

        const end_time_element = getElementById('expiry_time');
        /*
         * attach datepicker and timepicker to end time durations
         * have to use jquery
         */
        attachTimePicker('#expiry_time');
        $('#expiry_time')
            .on('focus click', () => { attachTimePicker('#expiry_time', 1); })
            .on('change input blur', function () {
                if (!dateValueChanged(this, 'time')) {
                    return false;
                }
                Durations.setTime(end_time_element.value, 1);
                return true;
            });

        /*
         * attach event to change in amount, request new price only
         */
        const amount_element = getElementById('amount');
        amount_element.addEventListener('keypress', onlyNumericOnKeypress);
        amount_element.addEventListener('input', CommonTrading.debounce((e) => {
            e.target.value = e.target.value.replace(/[^0-9.]/g, '');
            const currency = Defaults.get('currency');
            if (isStandardFloat(e.target.value)) {
                e.target.value = parseFloat(e.target.value).toFixed(getDecimalPlaces(currency));
            }
            Defaults.set(`amount${isCryptocurrency(currency) ? '_crypto' : ''}`, e.target.value);
            Price.processPriceRequest();
            CommonTrading.submitForm(getElementById('websocket_form'));
        }));

        /*
         * attach event to change in amount, request new price only
         */
        const multiplier_element = document.getElementById('multiplier');
        if (multiplier_element) {
            multiplier_element.addEventListener('keypress', onlyNumericOnKeypress);

            multiplier_element.addEventListener('input', CommonTrading.debounce((e) => {
                e.target.value = e.target.value.replace(/^0*(\d\.?)/, '$1');
                Defaults.set('multiplier', e.target.value);
                Price.processPriceRequest();
                CommonTrading.submitForm(document.getElementById('websocket_form'));
            }));
        }

        let timepicker_initialized = false;
        const initTimePicker       = () => {
            if (timepicker_initialized) return;
            timepicker_initialized = true;
            attachTimePicker('#time_start');
            $time_start
                .on('focus click', () => { attachTimePicker('#time_start'); })
                .on('change input blur', function () {
                    if (!dateValueChanged(this, 'time')) {
                        return false;
                    }
                    Defaults.set('time_start', time_start_element.value);
                    let make_price_request = 1;
                    if (Defaults.get('expiry_date')) {
                        // if time changed, proposal will be sent there if not we should send it here
                        make_price_request = Durations.selectEndDate(moment(Defaults.get('expiry_date'))) ? -1 : 1;
                    }
                    if (make_price_request > 0) {
                        Price.processPriceRequest();
                    }
                    return true;
                });
        };

        /*
         * attach event to start time, display duration based on
         * whether start time is forward starting or not and request
         * new price
         */
        const date_start_element = CommonIndependent.getStartDateNode();
        if (date_start_element) {
            date_start_element.addEventListener('change', (e) => {
                Defaults.set('date_start', e.target.value);
                initTimePicker();
                const r = Durations.onStartDateChange(e.target.value);
                Process.displayEquals();
                if (r >= 0) {
                    Price.processPriceRequest();
                }
            });
        }

        const time_start_element = getElementById('time_start');
        const $date_start        = $('#date_start');
        const $time_start        = $('#time_start');
        if (date_start_element.value !== 'now') {
            initTimePicker();
        }

        /*
         * attach event to change in amount type that is whether its
         * payout or stake and request new price
         */
        getElementById('amount_type').addEventListener('change', (e) => {
            Defaults.set('amount_type', e.target.value);
            Price.processPriceRequest();
        });

        /*
         * attach event to change in submarkets. We need to disable
         * underlyings that are not in selected seubmarkets
         */
        getElementById('submarket').addEventListener('change', (e) => {
            if (e.target) {
                const elem        = getElementById('underlying');
                const underlyings = elem.children;

                for (let i = 0, len = underlyings.length; i < len; i++) {
                    underlyings[i].disabled = e.target.value !== 'all' && e.target.value !== underlyings[i].className;
                }

                // as submarket change has modified the underlying list so we need to manually
                // fire change event for underlying
                document.querySelectorAll('#underlying option:enabled')[0].selected = 'selected';
                const event = new Event('change');
                elem.dispatchEvent(event);
            }
        });

        /*
         * attach an event to change in currency
         */
        $('.currency').on('change', (e) => {
            const currency = e.target.value;
            Defaults.set('currency', currency);
            const amount = isCryptocurrency(currency) ? 'amount_crypto' : 'amount';
            if (Defaults.get(amount)) $('#amount').val(Defaults.get(amount));
            Price.processPriceRequest();
        });

        /**
         * Handle Incoming Click or double click event.
         * @param {EventTarget} e
         */
        const preparePurchaseParams = (e) => {
            if (isVisible(getElementById('confirmation_message_container')) ||
                /disabled/.test(e.currentTarget.parentElement.classList)
                || !e.currentTarget.hasAttributes()) {
                return;
            }

            const id        = e.currentTarget.getAttribute('data-purchase-id');
            const ask_price = e.currentTarget.getAttribute('data-ask-price');
            const params    = { buy: id, price: ask_price, passthrough: {} };
            Array.prototype.slice.call(e.currentTarget.attributes).filter(attr => {
                if (!/^data/.test(attr.name) ||
                    /^data-balloon$/.test(attr.name) ||
                    /data-balloon/.test(attr.name) ||
                    /^data-passthrough$/.test(attr.name)) {
                    return false;
                }
                return true;
            })
                .forEach(attr=> {
                    params.passthrough[attr.name.substring(5)] = attr.value;
                });

            if (id && ask_price) {
                e.currentTarget.parentElement.classList.add('button-disabled');
                e.currentTarget.innerText = localize('Purchase request sent');
                BinarySocket.send(params).then((response) => {
                    Purchase.display(response);
                    GTM.pushPurchaseData(response);
                });
                Price.incrFormId();
                Price.processForgetProposals();
            }
        };

        /*
         * attach event to purchase buttons to buy the current contract
         */
        const el_purchase_button = document.querySelectorAll('.purchase_button');

        el_purchase_button.forEach(el => {
            el.addEventListener('click', preparePurchaseParams);
            el.addEventListener('dblclick', preparePurchaseParams);
        });

        /*
         * attach event to close icon for purchase container
         */
        $('#close_confirmation_container').on('click dblclick', (e) => {
            if (e.target && isVisible(getElementById('confirmation_message_container'))) {
                e.preventDefault();
                CommonTrading.hideOverlayContainer();
                Price.processPriceRequest();
                Purchase.onclose();
            }
        });

        /*
         * attach an event to change in barrier
         */
        $('#barrier')
            .on('keypress', (ev) => { onlyNumericOnKeypress(ev, [43, 45, 46]); })
            .on('input', CommonTrading.debounce((e) => {
                Barriers.validateBarrier();
                Defaults.set('barrier', e.target.value);
                Price.processPriceRequest();
                CommonTrading.submitForm(getElementById('websocket_form'));
            }, 1000));

        /*
         * attach an event to change in low barrier
         */
        const low_barrier_element = getElementById('barrier_low');
        low_barrier_element.addEventListener('input', CommonTrading.debounce((e) => {
            Barriers.validateBarrier();
            Defaults.set('barrier_low', e.target.value);
            Price.processPriceRequest();
            CommonTrading.submitForm(getElementById('websocket_form'));
        }));
        low_barrier_element.addEventListener('keypress', (ev) => {
            onlyNumericOnKeypress(ev, [43, 45, 46]);
        });

        /*
         * attach an event to change in high barrier
         */
        const high_barrier_element = getElementById('barrier_high');
        high_barrier_element.addEventListener('input', CommonTrading.debounce((e) => {
            Barriers.validateBarrier();
            Defaults.set('barrier_high', e.target.value);
            Price.processPriceRequest();
            CommonTrading.submitForm(getElementById('websocket_form'));
        }));
        high_barrier_element.addEventListener('keypress', (ev) => {
            onlyNumericOnKeypress(ev, [43, 45, 46]);
        });

        /*
         * attach an event to change in digit prediction input
         */
        getElementById('prediction').addEventListener('change', CommonTrading.debounce((e) => {
            Defaults.set('prediction', e.target.value);
            Price.processPriceRequest();
            CommonTrading.submitForm(getElementById('websocket_form'));
        }));

        getElementById('selected_tick').addEventListener('change', CommonTrading.debounce((e) => {
            Defaults.set('selected_tick', e.target.value);
            Price.processPriceRequest();
            CommonTrading.submitForm(getElementById('websocket_form'));
        }));

        // Verify number of decimal places doesn't exceed the allowed decimal places according to the currency
        const isStandardFloat = value => (
            !isNaN(value) &&
            value % 1 !== 0 &&
            ((+parseFloat(value)).toFixed(10)).replace(/^-?\d*\.?|0+$/g, '').length > getDecimalPlaces(Defaults.get('currency'))
        );

        getElementById('trading_init_progress').addEventListener('click', CommonTrading.debounce(() => {
            CommonTrading.reloadPage();
        }));
    };

    return {
        init: initiate,
    };
})();

module.exports = TradingEvents;
