/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
const dummy_current_time = 1665675860; // should be an epoch of some real tick!
const dummy_start_time = dummy_current_time - 7;
const dummy_end_time = dummy_current_time + 6;

const high_barrier = 6509;
const low_barrier = 6508;
const tick_1_price = low_barrier + 0.1;
const tick_2_price = low_barrier + 0.15;
const tick_3_price = low_barrier + 0.5;
const tick_4_price = low_barrier + 0.25;
const tick_5_price = low_barrier + 0.5;
const entry_spot = low_barrier + 0.33;
let exit_tick, exit_tick_display_value, exit_tick_time;
const tick_8_price = low_barrier + 0.75;
const previous_tick_price = low_barrier + 0.19;
const current_spot = low_barrier + 0.45;
const take_profit_price = low_barrier + 3;
const limit_order = {
    take_profit: {
        display_name: 'Take profit',
        order_amount: take_profit_price,
        order_date: 1653292620,
        value: `${take_profit_price}`,
    },
};
const stay_in_history_stats = [
    ...new Array(33).fill(1573),
    ...new Array(33).fill(4033),
    ...new Array(33).fill(2853),
    2913,
];
const break_out_history_stats = [
    ...new Array(33).fill(8884),
    ...new Array(33).fill(4444),
    ...new Array(33).fill(5554),
    1114,
];
const tick_passed = 4;
const tick_count = 1000;
const symbol = 'R_10';
const symbol_display_name = 'Volatility 10 Index';
const market = 'synthetic_index';
const submarket = 'random_index';
const exchange_name = 'RANDOM';

let contract_status = 'open'; // 'lost', 'won' or 'open'
let position_status = 'profit'; // 'profit' or 'loss'
let result = ''; // 'won' or 'lost'
let profit = +0.15;
let profit_percentage = +1.5;
let is_sold = 0; // 0 || 1

//losing:
// contract_status = 'open'; // 'lost', 'won' or 'open'
// profit = -10;
// profit_percentage = -100;
// is_sold = 0; // 0 || 1

// let first_time;
// const winLoseAndOpenContractInSec = (ms1, ms2, ms3) => {
//     setInterval(() => {
//         setTimeout(() => {
contract_status = 'won'; // 'lost', 'won' or 'open'
position_status = 'profit'; // 'profit' or 'loss'
result = 'won'; // 'won' or 'lost'
profit = +0.15;
profit_percentage = +1.5;
is_sold = 1; // 0 || 1
exit_tick = current_spot;
exit_tick_display_value = `${current_spot}`;
exit_tick_time = dummy_current_time;
//         }, ms1);
//         setTimeout(() => {
// contract_status = 'lost'; // 'lost', 'won' or 'open'
// position_status = 'loss'; // 'profit' or 'loss'
// result = 'lost'; // 'won' or 'lost'
// profit = -100;
// profit_percentage = -100;
// is_sold = 1; // 0 || 1
// exit_tick = low_barrier + 0.49;
// exit_tick_display_value = `${exit_tick}`;
// exit_tick_time = dummy_end_time;
//         }, ms2);
//         setTimeout(() => {
//             contract_status = 'open'; // 'lost', 'won' or 'open'
//             position_status = 'profit'; // 'profit' or 'loss'
//             result = ''; // 'won' or 'lost'
//             profit = +0.15;
//             profit_percentage = +1.5;
//             is_sold = 0; // 0 || 1
//         }, ms3);
//     }, ms3);
// };
const tick_size_barrier = 0.000409;
const longcode = `Win payout when every tick of your contract is within the barriers of the previous tick in ${symbol_display_name}.`;
const stake = '10.00';
const contract_type = 'ACCU'; // 'ACCU' or 'DECCU'
const shortcode = `ACCU_${symbol}_10.00_6_0.01_1_0.000409_1653292620`; // `DECCU_${symbol}_10.00_6_0.01_1_0.000409_1653292620`

export const getDummyPOCResponseForACCU = time_now => {
    return {
        echo_req: {
            proposal_open_contract: 1,
            req_id: 32,
            subscribe: 1,
        },
        msg_type: 'proposal_open_contract',
        proposal_open_contract: {
            account_id: 6528,
            barrier_count: 2,
            high_barrier,
            low_barrier,
            bid_price: 9.85,
            buy_price: 10,
            contract_id: 19459,
            contract_type,
            currency: 'USD',
            current_spot,
            current_spot_display_value: `${current_spot}`,
            current_spot_time: dummy_current_time,
            date_expiry: dummy_end_time,
            date_settlement: dummy_end_time + 1,
            date_start: dummy_start_time,
            display_name: symbol_display_name,
            entry_spot,
            entry_spot_display_value: `${entry_spot}`,
            entry_tick: entry_spot,
            entry_tick_display_value: `${entry_spot}`,
            entry_tick_time: dummy_start_time + 1,
            exit_tick,
            exit_tick_display_value,
            exit_tick_time,
            expiry_time: dummy_end_time,
            id: '2b88e20f-f976-a380-904d-04db08e10eeb',
            is_expired: 0,
            is_forward_starting: 0,
            is_intraday: 1,
            is_path_dependent: 0,
            is_settleable: 0,
            is_sold,
            is_valid_to_cancel: 0,
            is_valid_to_sell: 1,
            limit_order,
            tick_passed,
            longcode,
            growth_rate: 0.01,
            profit,
            profit_percentage,
            purchase_time: dummy_start_time,
            shortcode,
            status: contract_status,
            tick_count,
            tick_size_barrier,
            tick_stream: [
                {
                    epoch: dummy_start_time + 1,
                    tick: entry_spot,
                    tick_display_value: `${entry_spot}`,
                },
                {
                    epoch: dummy_start_time + 3,
                    tick: tick_8_price,
                    tick_display_value: `${tick_8_price}`,
                },
                {
                    epoch: dummy_start_time + 5,
                    tick: previous_tick_price,
                    tick_display_value: `${previous_tick_price}`,
                },
                {
                    epoch: dummy_current_time,
                    tick: current_spot,
                    tick_display_value: `${current_spot}`,
                },
            ],
            transaction_ids: {
                buy: 45479,
            },
            underlying: symbol,
        },
        req_id: 32,
        subscription: {
            id: '2b88e20f-f976-a380-904d-04db08e10eeb',
        },
    };
};

export const getDummyPortfolioContractsForACCU = time_now => {
    // if (!first_time) {
    //     const interval = 5000;
    //     winLoseAndOpenContractInSec(interval, interval * 2, interval * 3);
    //     first_time = true;
    // }
    return [
        {
            app_id: 17044,
            buy_price: 10,
            contract_id: 19459,
            contract_type,
            currency: 'USD',
            date_start: dummy_start_time,
            expiry_time: dummy_end_time,
            tick_passed,
            longcode,
            payout: 27.45,
            purchase_time: dummy_start_time,
            shortcode,
            symbol,
            transaction_id: 45479,
        },
    ];
};

export const getDummyAllPositionsForACCU = time_now => {
    return [
        {
            contract_info: {
                account_id: 6528,
                audit_details: {
                    all_ticks: [
                        {
                            epoch: dummy_start_time - 9,
                            tick: tick_1_price,
                            tick_display_value: `${tick_1_price}`,
                        },
                        {
                            epoch: dummy_start_time - 7,
                            tick: tick_2_price,
                            tick_display_value: `${tick_2_price}`,
                        },
                        {
                            epoch: dummy_start_time - 5,
                            tick: tick_3_price,
                            tick_display_value: `${tick_3_price}`,
                        },
                        {
                            epoch: dummy_start_time - 3,
                            tick: tick_4_price,
                            tick_display_value: `${tick_4_price}`,
                        },
                        {
                            epoch: dummy_start_time - 1,
                            tick: tick_5_price,
                            tick_display_value: `${tick_5_price}`,
                        },
                        {
                            epoch: dummy_start_time,
                            flag: 'highlight_time',
                            name: 'Start Time',
                        },
                        {
                            epoch: dummy_start_time + 1,
                            flag: 'highlight_tick',
                            name: 'Entry Spot',
                            tick: entry_spot,
                            tick_display_value: `${entry_spot}`,
                        },
                        {
                            epoch: dummy_start_time + 3,
                            tick: tick_8_price,
                            tick_display_value: `${tick_8_price}`,
                        },
                        {
                            epoch: dummy_start_time + 5,
                            tick: previous_tick_price,
                            tick_display_value: `${previous_tick_price}`,
                        },
                        {
                            epoch: dummy_current_time,
                            tick: current_spot,
                            tick_display_value: `${current_spot}`,
                        },
                    ],
                },
                barrier_count: 2,
                high_barrier: `${high_barrier}`,
                low_barrier: `${low_barrier}`,
                bid_price: 9.85,
                buy_price: 10,
                contract_id: 19459,
                contract_type,
                currency: 'USD',
                current_spot,
                current_spot_display_value: `${current_spot}`,
                current_spot_time: dummy_current_time,
                date_expiry: dummy_end_time,
                date_settlement: dummy_end_time + 1,
                date_start: dummy_start_time,
                display_name: symbol_display_name,
                entry_spot,
                entry_spot_display_value: `${entry_spot}`,
                entry_tick: entry_spot,
                entry_tick_display_value: `${entry_spot}`,
                entry_tick_time: dummy_start_time + 1,
                exit_tick,
                exit_tick_display_value,
                exit_tick_time,
                expiry_time: dummy_end_time,
                id: '2b88e20f-f976-a380-904d-04db08e10eeb',
                is_expired: 0,
                is_forward_starting: 0,
                is_intraday: 1,
                is_path_dependent: 0,
                is_settleable: 0,
                is_sold,
                is_valid_to_cancel: 0,
                is_valid_to_sell: 1,
                limit_order,
                tick_passed,
                longcode,
                growth_rate: 0.01,
                payout: 27.45,
                profit,
                profit_percentage,
                purchase_time: dummy_start_time,
                shortcode,
                status: contract_status,
                tick_count,
                tick_size_barrier,
                tick_stream: [
                    {
                        epoch: dummy_start_time + 1,
                        tick: entry_spot,
                        tick_display_value: `${entry_spot}`,
                    },
                    {
                        epoch: dummy_start_time + 3,
                        tick: tick_8_price,
                        tick_display_value: `${tick_8_price}`,
                    },
                    {
                        epoch: dummy_start_time + 5,
                        tick: previous_tick_price,
                        tick_display_value: `${previous_tick_price}`,
                    },
                    {
                        epoch: dummy_current_time,
                        tick: current_spot,
                        tick_display_value: `${current_spot}`,
                    },
                ],
                transaction_ids: {
                    buy: 45479,
                },
                underlying: symbol,
            },
            details: longcode,
            display_name: symbol_display_name,
            indicative: 8.46,
            payout: 27.45,
            purchase: 10,
            reference: 45479,
            type: contract_type,
            is_unsupported: false,
            profit_loss: profit,
            is_valid_to_sell: true,
            current_tick: 4,
            barrier_count: 2,
            high_barrier,
            low_barrier,
            entry_spot,
            is_loading: false,
            duration: 10,
            duration_unit: 'seconds',
            id: 19459,
            result,
            status: position_status,
        },
    ];
};
export const getDummyProposalInfoForACCU = (growth_rate, response) => {
    return {
        ticks_stayed_in: response.proposal.contract_details.ticks_stayed_in,
        tick_size_barrier: response.proposal.contract_details.tick_size_barrier,
        maximum_payout: response.proposal.contract_details.maximum_payout,
        maximum_ticks: response.proposal.contract_details.maximum_ticks,
        high_barrier: response.proposal.contract_details.high_barrier,
        last_tick_epoch: response.proposal.contract_details.last_tick_epoch,
        low_barrier: response.proposal.contract_details.low_barrier,
        error_code: undefined,
        error_field: undefined,
        growth_rate,
        has_error: false,
        has_error_details: false,
        has_increased: null,
        id: '2b88e20f-f976-a380-904d-04db08e10eeb',
        limit_order,
        message: longcode,
        obj_contract_basis: {
            text: '',
            value: '',
        },
        payout: 27.45,
        profit: `${profit}`,
        returns: '-100.00%',
        spot_time: response.proposal.spot_time,
        stake,
    };
};
export const getDummyProposalInfoForDECCU = (growth_rate, response) => {
    return {
        ticks_stayed_in: response.proposal.contract_details.ticks_stayed_in,
        tick_size_barrier: response.proposal.contract_details.tick_size_barrier,
        maximum_payout: response.proposal.contract_details.maximum_payout,
        maximum_ticks: response.proposal.contract_details.maximum_ticks,
        high_barrier: response.proposal.contract_details.high_barrier,
        last_tick_epoch: response.proposal.contract_details.last_tick_epoch,
        low_barrier: response.proposal.contract_details.low_barrier,
        error_code: undefined,
        error_field: undefined,
        growth_rate,
        has_error: false,
        has_error_details: false,
        has_increased: null,
        id: '2b88e20f-f976-a380-904d-04db08e10eec',
        limit_order,
        message: longcode,
        obj_contract_basis: {
            text: '',
            value: '',
        },
        payout: 27.45,
        profit: `${profit}`,
        returns: '-100.00%',
        spot_time: response.proposal.spot_time,
        stake,
    };
};

export const dummy_accu_in_contracts_for_available = {
    growth_rate_range: [0.01, 0.02, 0.03, 0.04, 0.05],
    barrier_category: 'american',
    barriers: 2,
    contract_category: 'accumulator',
    contract_category_display: 'Stay in/Break out',
    contract_display: 'Stay in',
    contract_type: 'ACCU',
    exchange_name,
    expiry_type: 'tick',
    market,
    max_contract_duration: '1d',
    min_contract_duration: '1s',
    sentiment: 'inside',
    start_type: 'spot',
    submarket,
    underlying_symbol: symbol,
};

export const dummy_deccu_in_contracts_for_available = {
    growth_rate_range: [0.01, 0.02, 0.03, 0.04, 0.05],
    barrier_category: 'american',
    barriers: 2,
    contract_category: 'accumulator',
    contract_category_display: 'Stay in/Break out',
    contract_display: 'Break out',
    contract_type: 'DECCU',
    exchange_name,
    expiry_type: 'tick',
    market,
    max_contract_duration: '1d',
    min_contract_duration: '1s',
    sentiment: 'inside',
    start_type: 'spot',
    submarket,
    underlying_symbol: symbol,
};

export const dummy_accumulators_proposals = {
    ACCU: {
        proposal: 1,
        subscribe: 1,
        amount: 10,
        basis: 'stake',
        contract_type: 'ACCU',
        currency: 'USD',
        symbol,
        growth_rate: 0.01,
    },
    DECCU: {
        proposal: 1,
        subscribe: 1,
        amount: 10,
        basis: 'stake',
        contract_type: 'DECCU',
        currency: 'USD',
        symbol,
        growth_rate: 0.01,
    },
};

export const getDummyProposalResponseForACCU = time_now => {
    return {
        echo_req: {
            amount: 10,
            basis: 'stake',
            contract_type,
            currency: 'USD',
            duration_unit: 's',
            limit_order: {
                take_profit: 150,
            },
            growth_rate: 0.01,
            product_type: 'basic',
            proposal: 1,
            req_id: 32,
            subscribe: 1,
            symbol,
        },
        msg_type: 'proposal',
        proposal: {
            contract_details: {
                high_barrier,
                last_tick_epoch: dummy_current_time,
                low_barrier,
                maximum_payout: 20000,
                maximum_ticks: tick_count,
                tick_size_barrier,
                ticks_stayed_in: stay_in_history_stats,
            },
            ask_price: 10,
            date_expiry: dummy_end_time,
            date_start: dummy_start_time,
            display_value: '10.00',
            id: '2b88e20f-f976-a380-904d-04db08e10eeb',
            limit_order,
            longcode,
            payout: 27.45,
            spot: current_spot,
            spot_time: dummy_current_time,
        },
        req_id: 32,
        subscription: {
            id: '2b88e20f-f976-a380-904d-04db08e10eeb',
        },
    };
};

export const getDummyProposalResponseForDECCU = time_now => {
    return {
        echo_req: {
            amount: 10,
            basis: 'stake',
            contract_type: 'DECCU',
            currency: 'USD',
            duration_unit: 's',
            limit_order: {
                take_profit: 150,
            },
            growth_rate: 0.01,
            product_type: 'basic',
            proposal: 1,
            req_id: 32,
            subscribe: 1,
            symbol,
        },
        msg_type: 'proposal',
        proposal: {
            contract_details: {
                high_barrier,
                last_tick_epoch: dummy_current_time,
                low_barrier,
                maximum_payout: 20000,
                maximum_ticks: tick_count,
                tick_size_barrier,
                ticks_stayed_in: break_out_history_stats,
            },
            ask_price: 10,
            date_expiry: dummy_end_time,
            date_start: dummy_start_time,
            display_value: '10.00',
            id: '2b88e20f-f976-a380-904d-04db08e10eec',
            limit_order,
            longcode,
            payout: 27.45,
            spot: current_spot,
            spot_time: dummy_current_time,
        },
        req_id: 32,
        subscription: {
            id: '2b88e20f-f976-a380-904d-04db08e10eec',
        },
    };
};

export const dummy_purchase_response_for_accu = {
    buy: {
        balance_after: 10018.99,
        buy_price: 10,
        contract_id: 19459,
        longcode,
        payout: 0,
        purchase_time: 1656351535,
        shortcode,
        start_time: 1656351535,
        transaction_id: 45479,
    },
    echo_req: {
        buy: '2b88e20f-f976-a380-904d-04db08e10eeb',
        price: '10.00',
        req_id: 32,
    },
    msg_type: 'buy',
    req_id: 32,
};
