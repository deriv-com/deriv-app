const getFormNameBarrierCategory = require('./common').getFormNameBarrierCategory;
const localize                   = require('../../../_common/localize').localize;
const getPropertyValue           = require('../../../_common/utility').getPropertyValue;
const isEmptyObject              = require('../../../_common/utility').isEmptyObject;

/*
 * Contract object mocks the trading form we have on our website
 * It parses the contracts json we get from socket.send({contracts_for: 'R_50'})
 * and gives back barriers, startDate, durations etc
 *
 *
 * Usage:
 *
 * use `Contract.details` to populate this object
 *
 * then use
 *
 * `Contract.durations()` to get durations like seconds, hours etc
 * `Contract.open()` `Contract.close()`
 * `Contract.barriers` if applicable for current underlying
 */
const Contract = (() => {
    const contract_type = {};

    let contract_details = {};
    let barriers         = {};
    let durations        = {};
    let start_dates      = {};

    let open,
        close,
        form,
        barrier;

    const populateDurations = (current_contract) => {
        const current_category = current_contract.contract_category;
        const expiry_type      = current_contract.expiry_type;
        const barrier_category = current_contract.barrier_category;
        const start_type       = current_contract.start_type;
        const max_duration     = current_contract.max_contract_duration;
        const min_duration     = current_contract.min_contract_duration;

        if (!durations[expiry_type]) {
            durations[expiry_type] = {};
        }

        if (!durations[expiry_type][current_category]) {
            durations[expiry_type][current_category] = {};
        }

        if (!durations[expiry_type][current_category][barrier_category]) {
            durations[expiry_type][current_category][barrier_category] = {};
        }

        if (!durations[expiry_type][current_category][barrier_category][start_type]) {
            durations[expiry_type][current_category][barrier_category][start_type] = {};
        }

        durations[expiry_type][current_category][barrier_category][start_type].max_contract_duration = max_duration;

        durations[expiry_type][current_category][barrier_category][start_type].min_contract_duration = min_duration;
    };

    const details = (form_name) => {
        const contracts = Contract.contracts().contracts_for;

        if (!contracts) return;

        start_dates = { has_spot: 0, list: [] };
        durations   = {};
        open        = contracts.open;
        close       = contracts.close;

        const form_barrier = getFormNameBarrierCategory(form_name);
        form               = form_barrier.form_name;
        if (!form) {
            return;
        }
        barrier = form_barrier.barrier_category;

        contracts.available.forEach((current_obj) => {
            const contract_category = current_obj.contract_category;
            // for callput and callputequals, populate duration for both
            if (form === contract_category || (/callput/.test(form) && /callput/.test(contract_category))) {
                if (barrier) {
                    if (barrier === current_obj.barrier_category) {
                        populateDurations(current_obj);
                    }
                } else {
                    populateDurations(current_obj);
                }
            }
            if (form === contract_category) {
                if (current_obj.forward_starting_options && current_obj.start_type === 'forward' && sessionStorage.formname !== 'higherlower') {
                    start_dates.list = current_obj.forward_starting_options;
                } else if (current_obj.start_type === 'spot') {
                    start_dates.has_spot = 1;
                }

                const symbol = current_obj.underlying_symbol;
                if (current_obj.barrier_category && current_obj.barrier_category !== 'non_financial') {
                    if (!getPropertyValue(barriers, symbol)) {
                        barriers[symbol] = {};
                    }
                    if (!getPropertyValue(barriers[symbol], contract_category)) {
                        barriers[symbol][contract_category] = {};
                    }
                    if (!getPropertyValue(barriers[symbol][contract_category], current_obj.expiry_type)) {
                        barriers[symbol][contract_category][current_obj.expiry_type] = {};
                    }
                    if (current_obj.barriers === 1) {
                        barriers[symbol][contract_category][current_obj.expiry_type] = {
                            count           : 1,
                            barrier         : current_obj.barrier,
                            barrier_category: current_obj.barrier_category,
                        };
                    } else if (current_obj.barriers === 2) {
                        barriers[symbol][contract_category][current_obj.expiry_type] = {
                            count           : 2,
                            barrier         : current_obj.high_barrier,
                            barrier1        : current_obj.low_barrier,
                            barrier_category: current_obj.barrier_category,
                        };
                    }
                }

                if (!contract_type[contract_category]) {
                    contract_type[contract_category] = {};
                }

                const type = current_obj.contract_type;
                if (!getPropertyValue(contract_type[contract_category], type)) {
                    contract_type[contract_category][type] =
                        localize(current_obj.contract_display /* localize-ignore */); // handled in static_strings_app.js
                }
            }
        });

        if (barrier) {
            if (barriers && barriers[form] && barriers[form].barrier_category !== barrier) {
                barriers = {};
            }
        }
    };

    const getContractForms = () => {
        const contracts            = Contract.contracts().contracts_for;
        const trade_contract_forms = {};

        if (!contracts) return null;

        contracts.available.forEach((current_obj) => {
            const contract_category = current_obj.contract_category;
            if (contract_category && !getPropertyValue(trade_contract_forms, contract_category)) {
                if (contract_category === 'callput') {
                    if (current_obj.barrier_category === 'euro_atm') {
                        trade_contract_forms.risefall = localize('Rise/Fall');
                    } else {
                        trade_contract_forms.higherlower = localize('Higher/Lower');
                    }
                } else {
                    trade_contract_forms[contract_category] =
                        localize(current_obj.contract_category_display /* localize-ignore */); // handled in static_strings_app.js: Asian
                    if (contract_category === 'digits') {
                        trade_contract_forms.matchdiff = localize('Matches/Differs');
                        trade_contract_forms.evenodd   = localize('Even/Odd');
                        trade_contract_forms.overunder = localize('Over/Under');
                    } else if (contract_category === 'lookback') {
                        trade_contract_forms.lookbackhigh    = localize('High-Close');
                        trade_contract_forms.lookbacklow     = localize('Close-Low');
                        trade_contract_forms.lookbackhighlow = localize('High-Low');
                    } else if (contract_category === 'reset') {
                        trade_contract_forms.resetcall = localize('Reset Call');
                        trade_contract_forms.resetput  = localize('Reset Put');
                    }
                }
            }
        });

        if (isEmptyObject(trade_contract_forms)) return null;

        if (trade_contract_forms.risefall || trade_contract_forms.higherlower) {
            trade_contract_forms.updown = localize('Up/Down');
        }

        if (trade_contract_forms.runs) {
            trade_contract_forms.run = localize('Only Ups/Only Downs');
        }

        if (trade_contract_forms.endsinout || trade_contract_forms.staysinout) {
            trade_contract_forms.inout = localize('In/Out');
        }

        return trade_contract_forms;
    };

    return {
        details,
        contractForms: getContractForms,
        open         : () => open,
        close        : () => close,
        contracts    : () => contract_details,
        durations    : () => durations,
        startDates   : () => start_dates,
        barriers     : () => barriers,
        contractType : () => contract_type,
        form         : () => form,
        barrier      : () => barrier,
        setContracts : (data) => { contract_details = data; },
    };
})();

module.exports = Contract;
