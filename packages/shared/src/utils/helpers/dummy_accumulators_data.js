const high_barrier = 92.93;
const low_barrier = 92.855;
const tick_1_price = 92.444;
const tick_2_price = 92.317;
const tick_3_price = 92.431;
const tick_4_price = 92.544;
const tick_5_price = 92.832;
const entry_spot = 92.812;
const tick_8_price = 92.678;
const previous_tick_price = 92.693;
const current_spot = 92.823;
const take_profit_price = 90.021;
const contract_status = 'open';
const position_status = 'loss'; // 'profit' or 'loss'
const profit_loss = -0.15;

export const getDummyPOCResponseForACC = time_now => {
    const dummy_current_time = Math.round(time_now / 1000); // 10 digits number
    const dummy_start_time = dummy_current_time - 7;
    const dummy_end_time = dummy_current_time + 6;
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
            contract_type: 'ACC',
            currency: 'USD',
            current_spot,
            current_spot_display_value: `${current_spot}`,
            current_spot_time: dummy_current_time,
            date_expiry: dummy_end_time,
            date_settlement: dummy_end_time + 1,
            date_start: dummy_start_time,
            display_name: 'AUD/JPY',
            entry_spot,
            entry_spot_display_value: `${entry_spot}`,
            entry_tick: entry_spot,
            entry_tick_display_value: `${entry_spot}`,
            entry_tick_time: dummy_start_time + 1,
            expiry_time: dummy_end_time,
            id: '2b88e20f-f976-a380-904d-04db08e10eeb',
            is_expired: 0,
            is_forward_starting: 0,
            is_intraday: 1,
            is_path_dependent: 0,
            is_settleable: 0,
            is_sold: 0,
            is_valid_to_cancel: 0,
            is_valid_to_sell: 1,
            limit_order: {
                take_profit: {
                    display_name: 'Take profit',
                    order_amount: 150,
                    order_date: dummy_start_time - 10,
                    value: `${take_profit_price}`,
                },
            },
            longcode: 'Win payout when every tick of your contract is within ± 0.1 % of the previous tick in AUD/JPY.',
            growth_rate: 0.01,
            profit: profit_loss,
            profit_percentage: -1.5,
            purchase_time: dummy_start_time,
            shortcode: 'ACC_FRXAUDJPY_10.00_1656407458_4810060799_0_150.00',
            status: contract_status,
            tick_count: 10,
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
            underlying: 'frxAUDJPY',
        },
        req_id: 32,
        subscription: {
            id: '2b88e20f-f976-a380-904d-04db08e10eeb',
        },
    };
};

export const getDummyPortfolioContractsForACC = time_now => {
    const dummy_current_time = Math.round(time_now / 1000); // 10 digit number
    const dummy_start_time = dummy_current_time - 7;
    const dummy_end_time = dummy_current_time + 6;
    return [
        {
            app_id: 17044,
            buy_price: 10,
            contract_id: 19459,
            contract_type: 'ACC',
            currency: 'USD',
            date_start: dummy_start_time,
            expiry_time: dummy_end_time,
            longcode: 'Win payout when every tick of your contract is within ± 0.1 % of the previous tick in AUD/JPY.',
            payout: 27.45,
            purchase_time: dummy_start_time,
            shortcode: 'ACC_FRXAUDJPY_10.00_1656407458_4810060799_0_150.00',
            symbol: 'frxAUDJPY',
            transaction_id: 45479,
        },
    ];
};

export const getDummyAllPositionsForACC = time_now => {
    const dummy_current_time = Math.round(time_now / 1000); // 10 digits number
    const dummy_start_time = dummy_current_time - 7;
    const dummy_end_time = dummy_current_time + 6;
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
                contract_type: 'ACC',
                currency: 'USD',
                current_spot,
                current_spot_display_value: `${current_spot}`,
                current_spot_time: dummy_current_time,
                date_expiry: dummy_end_time,
                date_settlement: dummy_end_time + 1,
                date_start: dummy_start_time,
                display_name: 'AUD/JPY',
                entry_spot,
                entry_spot_display_value: `${entry_spot}`,
                entry_tick: entry_spot,
                entry_tick_display_value: `${entry_spot}`,
                entry_tick_time: dummy_start_time + 1,
                expiry_time: dummy_end_time,
                id: '2b88e20f-f976-a380-904d-04db08e10eeb',
                is_expired: 0,
                is_forward_starting: 0,
                is_intraday: 1,
                is_path_dependent: 0,
                is_settleable: 0,
                is_sold: 0,
                is_valid_to_cancel: 0,
                is_valid_to_sell: 1,
                limit_order: {
                    take_profit: {
                        display_name: 'Take profit',
                        order_amount: 150,
                        order_date: dummy_start_time - 10,
                        value: `${take_profit_price}`,
                    },
                },
                longcode:
                    'Win payout when every tick of your contract is within ± 0.1 % of the previous tick in AUD/JPY.',
                growth_rate: 0.01,
                payout: 27.45,
                profit: profit_loss,
                profit_percentage: -1.5,
                purchase_time: dummy_start_time,
                shortcode: 'ACC_FRXAUDJPY_10.00_1656407458_4810060799_0_150.00',
                status: contract_status,
                tick_count: 10,
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
                underlying: 'frxAUDJPY',
            },
            details: 'Win payout when every tick of your contract is within ± 0.1 % of the previous tick in AUD/JPY.',
            display_name: 'AUD/JPY',
            indicative: 8.46,
            payout: 27.45,
            purchase: 10,
            reference: 45479,
            type: 'ACC',
            is_unsupported: false,
            profit_loss,
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
            status: position_status,
        },
    ];
};
export const getDummyProposalInfoForACC = (growth_rate, time_now, response) => {
    const dummy_current_time = Math.round(time_now / 1000); // 10 digits number
    const dummy_start_time = dummy_current_time - 7;
    return {
        tick_size_barrier: response.proposal.tick_size_barrier,
        ticks_count_since_loss_condition: response.proposal.ticks_count_since_loss_condition,
        max_duration_ticks: response.proposal.max_duration_ticks, // = tick_count in proposal_open_contract
        max_payout: response.proposal.max_payout,
        high_barrier: response.proposal.high_barrier,
        low_barrier: response.proposal.low_barrier,
        error_code: undefined,
        error_field: undefined,
        growth_rate,
        has_error: false,
        has_error_details: false,
        has_increased: null,
        id: '2b88e20f-f976-a380-904d-04db08e10eeb',
        limit_order: {
            take_profit: {
                display_name: 'Take profit',
                order_amount: 150,
                order_date: dummy_start_time - 10,
                value: `${take_profit_price}`,
            },
        },
        message: 'Win payout when every tick of your contract is within ± 0.1 % of the previous tick in AUD/JPY.',
        obj_contract_basis: {
            text: '',
            value: '',
        },
        payout: 27.45,
        profit: `${profit_loss}`,
        returns: '-100.00%',
        stake: '10.00',
    };
};

export const dummy_accumulator_in_contracts_for_available = {
    accumulator_growth_rates: [0.01, 0.02, 0.03, 0.04, 0.05],
    barrier_category: 'american',
    barriers: 2,
    contract_category: 'accumulator',
    contract_category_display: 'Accumulate',
    contract_display: 'Accumulators',
    contract_type: 'ACC',
    exchange_name: 'FOREX',
    expiry_type: 'daily',
    market: 'forex',
    max_contract_duration: '1d',
    min_contract_duration: '1m',
    sentiment: 'inside',
    start_type: 'spot',
    submarket: 'major_pairs',
    underlying_symbol: 'frxAUDJPY',
};

export const dummy_multupliers_proposal = {
    MULTUP: {
        proposal: 1,
        subscribe: 1,
        amount: 10,
        basis: 'stake',
        contract_type: 'MULTUP',
        currency: 'USD',
        symbol: 'frxAUDJPY',
        multiplier: 30,
    },
    MULTDOWN: {
        proposal: 1,
        subscribe: 1,
        amount: 10,
        basis: 'stake',
        contract_type: 'MULTDOWN',
        currency: 'USD',
        symbol: 'frxAUDJPY',
        multiplier: 30,
    },
};

export const getDummyProposalResponseForACC = time_now => {
    const dummy_current_time = Math.round(time_now / 1000); // 10 digits number
    const dummy_start_time = dummy_current_time - 7;
    const dummy_end_time = dummy_current_time + 6;
    return {
        echo_req: {
            amount: 10,
            basis: 'stake',
            contract_type: 'ACC',
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
            symbol: 'frxAUDJPY',
        },
        msg_type: 'proposal',
        proposal: {
            tick_size_barrier: 0.000409,
            ticks_count_since_loss_condition: 13,
            max_duration_ticks: 10, // = tick_count in proposal_open_contract
            max_payout: 0,
            high_barrier,
            low_barrier,
            ask_price: 10,
            date_expiry: dummy_end_time,
            date_start: dummy_start_time,
            display_value: '10.00',
            id: '2b88e20f-f976-a380-904d-04db08e10eeb',
            limit_order: {
                take_profit: {
                    display_name: 'Take profit',
                    order_amount: 150,
                    order_date: dummy_start_time - 10,
                    value: `${take_profit_price}`,
                },
            },
            longcode: 'Win payout when every tick of your contract is within ± 0.1 % of the previous tick in AUD/JPY.',
            growth_rate: 0.01,
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

export const dummy_purchase_response_for_acc = {
    buy: {
        balance_after: 10018.99,
        buy_price: 10,
        contract_id: 19459,
        longcode: 'Win payout when every tick of your contract is within ± 0.1 % of the previous tick in AUD/JPY.',
        payout: 0,
        purchase_time: 1656351535,
        shortcode: 'ACC_FRXAUDJPY_10.00_1656407458_4810060799_0_150.00',
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
