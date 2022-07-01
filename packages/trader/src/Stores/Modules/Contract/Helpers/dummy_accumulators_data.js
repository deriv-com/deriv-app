export const getDummyPOCResponseForACC = time_now => {
    const dummy_current_time = Math.round(time_now / 1000); // 1656513908
    const dummy_start_time = dummy_current_time - 7; // 1656513901
    const dummy_end_time = dummy_current_time + 6; // 4810060799
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
            high_barrier: '19423.76',
            low_barrier: '19391.76',
            bid_price: 9.85,
            buy_price: 10,
            contract_id: 19459,
            contract_type: 'ACC',
            currency: 'USD',
            current_spot: 19406.92,
            current_spot_display_value: '19406.92',
            current_spot_time: dummy_current_time,
            date_expiry: dummy_end_time,
            date_settlement: dummy_end_time + 1,
            date_start: dummy_start_time,
            display_name: 'Volatility 100 Index',
            entry_spot: 19417.25,
            entry_spot_display_value: '19417.25',
            entry_tick: 19417.25,
            entry_tick_display_value: '19417.25',
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
                    value: '19400.25',
                },
            },
            longcode:
                'Win payout when every tick of your contract is within ± 0.1 % of the previous tick in Volatility 100 Index.',
            growth_rate: 0.01,
            profit: -0.15,
            profit_percentage: -1.5,
            purchase_time: dummy_start_time,
            shortcode: 'ACC_R_100_10.00_30_1656407458_4810060799_0_150.00',
            status: 'open',
            tick_count: 10,
            tick_stream: [
                {
                    epoch: dummy_start_time + 1,
                    tick: 19417.25,
                    tick_display_value: '19417.25',
                },
                {
                    epoch: dummy_start_time + 3,
                    tick: 19414.86,
                    tick_display_value: '19414.86',
                },
                {
                    epoch: dummy_start_time + 5,
                    tick: 19406.25,
                    tick_display_value: '19406.25',
                },
                {
                    epoch: dummy_current_time,
                    tick: 19406.92,
                    tick_display_value: '19406.92',
                },
            ],
            transaction_ids: {
                buy: 45479,
            },
            underlying: 'R_100',
        },
        req_id: 32,
        subscription: {
            id: '2b88e20f-f976-a380-904d-04db08e10eeb',
        },
    };
};

export const getDummyPortfolioContractsForACC = time_now => {
    const dummy_current_time = Math.round(time_now / 1000); // 1656513908
    const dummy_start_time = dummy_current_time - 7; // 1656513901
    const dummy_end_time = dummy_current_time + 6; // 4810060799
    return [
        {
            app_id: 17044,
            buy_price: 10,
            contract_id: 19459,
            contract_type: 'ACC',
            currency: 'USD',
            date_start: dummy_start_time,
            expiry_time: dummy_end_time,
            longcode:
                'Win payout when every tick of your contract is within ± 0.1 % of the previous tick in Volatility 100 Index.',
            payout: 27.45,
            purchase_time: dummy_start_time,
            shortcode: 'ACC_R_100_10.00_30_1656407458_4810060799_0_150.00',
            symbol: 'R_100',
            transaction_id: 45479,
        },
    ];
};

export const getDummyAllPositionsForACC = time_now => {
    const dummy_current_time = Math.round(time_now / 1000); // 1656513908
    const dummy_start_time = dummy_current_time - 7; // 1656513901
    const dummy_end_time = dummy_current_time + 6; // 4810060799
    return [
        {
            contract_info: {
                account_id: 6528,
                audit_details: {
                    all_ticks: [
                        {
                            epoch: dummy_start_time - 9,
                            tick: 19413.55,
                            tick_display_value: '19413.55',
                        },
                        {
                            epoch: dummy_start_time - 7,
                            tick: 19413.15,
                            tick_display_value: '19413.15',
                        },
                        {
                            epoch: dummy_start_time - 5,
                            tick: 19413.25,
                            tick_display_value: '19413.25',
                        },
                        {
                            epoch: dummy_start_time - 3,
                            tick: 19414.25,
                            tick_display_value: '19414.25',
                        },
                        {
                            epoch: dummy_start_time - 1,
                            tick: 19416.25,
                            tick_display_value: '19416.25',
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
                            tick: 19417.25,
                            tick_display_value: '19417.25',
                        },
                        {
                            epoch: dummy_start_time + 3,
                            tick: 19414.86,
                            tick_display_value: '19414.86',
                        },
                        {
                            epoch: dummy_start_time + 5,
                            tick: 19406.25,
                            tick_display_value: '19406.25',
                        },
                        {
                            epoch: dummy_current_time,
                            tick: 19406.92,
                            tick_display_value: '19406.92',
                        },
                    ],
                },
                barrier_count: 2,
                high_barrier: '19423.76',
                low_barrier: '19391.76',
                bid_price: 9.85,
                buy_price: 10,
                contract_id: 19459,
                contract_type: 'ACC',
                currency: 'USD',
                current_spot: 19406.92,
                current_spot_display_value: '19406.92',
                current_spot_time: dummy_current_time,
                date_expiry: dummy_end_time,
                date_settlement: dummy_end_time + 1,
                date_start: dummy_start_time,
                display_name: 'Volatility 100 Index',
                entry_spot: 19417.25,
                entry_spot_display_value: '19417.25',
                entry_tick: 19417.25,
                entry_tick_display_value: '19417.25',
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
                        value: '19400.25',
                    },
                },
                longcode:
                    'Win payout when every tick of your contract is within ± 0.1 % of the previous tick in Volatility 100 Index.',
                growth_rate: 0.01,
                payout: 27.45,
                profit: -0.15,
                profit_percentage: -1.5,
                purchase_time: dummy_start_time,
                shortcode: 'ACC_R_100_10.00_30_1656407458_4810060799_0_150.00',
                status: 'open',
                tick_count: 10,
                tick_stream: [
                    {
                        epoch: dummy_start_time + 1,
                        tick: 19417.25,
                        tick_display_value: '19417.25',
                    },
                    {
                        epoch: dummy_start_time + 3,
                        tick: 19414.86,
                        tick_display_value: '19414.86',
                    },
                    {
                        epoch: dummy_start_time + 5,
                        tick: 19406.25,
                        tick_display_value: '19406.25',
                    },
                    {
                        epoch: dummy_current_time,
                        tick: 19406.92,
                        tick_display_value: '19406.92',
                    },
                ],
                transaction_ids: {
                    buy: 45479,
                },
                underlying: 'R_100',
            },
            details:
                'Win payout when every tick of your contract is within ± 0.1 % of the previous tick in Volatility 100 Index.',
            display_name: 'Volatility 100 Index',
            indicative: 8.46,
            payout: 27.45,
            purchase: 10,
            reference: 45479,
            type: 'ACC',
            is_unsupported: false,
            profit_loss: -0.15,
            is_valid_to_sell: true,
            current_tick: 4,
            barrier_count: 2,
            high_barrier: 19423.76,
            low_barrier: 19391.76,
            entry_spot: 19417.25,
            is_loading: false,
            duration: 10,
            duration_unit: 'seconds',
            id: 19459,
            status: 'loss',
        },
    ];
};

export const getDummyProposalInfoForACC = growth_rate => ({
    tick_size_barrier: 0.000409,
    ticks_count_since_loss_condition: 13,
    max_duration_ticks: 10,
    max_payout: 0,
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
            order_amount: 89,
            order_date: 1655390008,
            value: '1471.48',
        },
    },
    message:
        'Win payout when every tick of your contract is within ± 0.1 % of the previous tick in Volatility 100 Index.',
    obj_contract_basis: {
        text: '',
        value: '',
    },
    payout: 0,
    profit: '-10.00',
    returns: '-100.00%',
    stake: '10.00',
});

export const dummy_accumulator_in_contracts_for_available = {
    accumulator_growth_rates: [0.01, 0.02, 0.03, 0.04, 0.05],
    barrier_category: 'american',
    barriers: 2,
    contract_category: 'accumulator',
    contract_category_display: 'Accumulate',
    contract_display: 'Accumulators',
    contract_type: 'ACC',
    exchange_name: 'RANDOM',
    expiry_type: 'intraday',
    market: 'synthetic_index',
    max_contract_duration: '1d',
    min_contract_duration: '1m',
    sentiment: 'inside',
    start_type: 'spot',
    submarket: 'random_index',
    underlying_symbol: 'R_100',
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

export const dummy_proposal_response_for_acc = {
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
        symbol: 'R_100',
    },
    msg_type: 'proposal',
    proposal: {
        ask_price: 10,
        date_expiry: 4809974399,
        date_start: 1656350092,
        display_value: '10.00',
        id: '2b88e20f-f976-a380-904d-04db08e10eeb',
        limit_order: {
            take_profit: {
                display_name: 'Take profit',
                order_amount: 150,
                order_date: 1656350092,
                value: '9503.27',
            },
        },
        longcode:
            'Win payout when every tick of your contract is within ± 0.1 % of the previous tick in Volatility 100 Index.',
        growth_rate: 0.01,
        payout: 0,
        spot: 19014.14,
        spot_time: 1656350092,
    },
    req_id: 32,
    subscription: {
        id: '2b88e20f-f976-a380-904d-04db08e10eeb',
    },
};

export const dummy_purchase_response_for_acc = {
    buy: {
        balance_after: 10018.99,
        buy_price: 10,
        contract_id: 175376893988,
        longcode:
            'Win payout when every tick of your contract is within ± 0.1 % of the previous tick in Volatility 100 Index.',
        payout: 0,
        purchase_time: 1656351535,
        shortcode: 'ACC_R_100_10.00_30_1656407458_4810060799_0_150.00',
        start_time: 1656351535,
        transaction_id: 350061244728,
    },
    echo_req: {
        buy: '2b88e20f-f976-a380-904d-04db08e10eeb',
        price: '10.00',
        req_id: 32,
    },
    msg_type: 'buy',
    req_id: 32,
};
