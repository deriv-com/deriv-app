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
            high_barrier: 8970.04,
            low_barrier: 8930.04,
            bid_price: 9.85,
            buy_price: 10,
            contract_id: 19459,
            contract_type: 'ACC',
            currency: 'USD',
            current_spot: 8775.04,
            current_spot_display_value: '8775.04',
            current_spot_time: dummy_current_time,
            date_expiry: dummy_end_time,
            date_settlement: dummy_end_time + 1,
            date_start: dummy_start_time,
            display_name: 'Volatility 100 Index',
            entry_spot: 8782.32,
            entry_spot_display_value: '8782.32',
            entry_tick: 8782.32,
            entry_tick_display_value: '8782.32',
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
                    value: '8745.01',
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
                    tick: 8782.32,
                    tick_display_value: '8782.32',
                },
                {
                    epoch: dummy_start_time + 3,
                    tick: 8776.32,
                    tick_display_value: '8776.32',
                },
                {
                    epoch: dummy_start_time + 5,
                    tick: 8769.32,
                    tick_display_value: '8769.32',
                },
                {
                    epoch: dummy_current_time,
                    tick: 8768.32,
                    tick_display_value: '8768.32',
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
                            tick: 8743.33,
                            tick_display_value: '8743.33',
                        },
                        {
                            epoch: dummy_start_time - 7,
                            tick: 8735.01,
                            tick_display_value: '8735.01',
                        },
                        {
                            epoch: dummy_start_time - 5,
                            tick: 8745.06,
                            tick_display_value: '8745.06',
                        },
                        {
                            epoch: dummy_start_time - 3,
                            tick: 8749.06,
                            tick_display_value: '8749.06',
                        },
                        {
                            epoch: dummy_start_time - 1,
                            tick: 8753.04,
                            tick_display_value: '8753.04',
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
                            tick: 8782.32,
                            tick_display_value: '8782.32',
                        },
                        {
                            epoch: dummy_start_time + 3,
                            tick: 8776.32,
                            tick_display_value: '8776.32',
                        },
                        {
                            epoch: dummy_start_time + 5,
                            tick: 8769.32,
                            tick_display_value: '8769.32',
                        },
                        {
                            epoch: dummy_current_time,
                            tick: 8768.32,
                            tick_display_value: '8768.32',
                        },
                    ],
                },
                barrier_count: 2,
                high_barrier: '8970.04',
                low_barrier: '8930.04',
                bid_price: 9.85,
                buy_price: 10,
                contract_id: 19459,
                contract_type: 'ACC',
                currency: 'USD',
                current_spot: 8775.04,
                current_spot_display_value: '8775.04',
                current_spot_time: dummy_current_time,
                date_expiry: dummy_end_time,
                date_settlement: dummy_end_time + 1,
                date_start: dummy_start_time,
                display_name: 'Volatility 100 Index',
                entry_spot: 8782.32,
                entry_spot_display_value: '8782.32',
                entry_tick: 8782.32,
                entry_tick_display_value: '8782.32',
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
                        value: '8745.01',
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
                        tick: 8782.32,
                        tick_display_value: '8782.32',
                    },
                    {
                        epoch: dummy_start_time + 3,
                        tick: 8776.32,
                        tick_display_value: '8776.32',
                    },
                    {
                        epoch: dummy_start_time + 5,
                        tick: 8769.32,
                        tick_display_value: '8769.32',
                    },
                    {
                        epoch: dummy_current_time,
                        tick: 8768.32,
                        tick_display_value: '8768.32',
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
            high_barrier: 8970.04,
            low_barrier: 8930.04,
            entry_spot: 8782.32,
            is_loading: false,
            duration: 10,
            duration_unit: 'seconds',
            id: 19459,
            status: 'loss',
        },
    ];
};
export const getDummyProposalInfoForACC = (growth_rate, time_now, response) => {
    const dummy_current_time = Math.round(time_now / 1000); // 1656513908
    const dummy_start_time = dummy_current_time - 7; // 1656513901
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
                value: '8745.01',
            },
        },
        message:
            'Win payout when every tick of your contract is within ± 0.1 % of the previous tick in Volatility 100 Index.',
        obj_contract_basis: {
            text: '',
            value: '',
        },
        payout: 27.45,
        profit: '-0.15',
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

export const getDummyProposalResponseForACC = time_now => {
    const dummy_current_time = Math.round(time_now / 1000); // 1656513908
    const dummy_start_time = dummy_current_time - 7; // 1656513901
    const dummy_end_time = dummy_current_time + 6; // 4810060799
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
            symbol: 'R_100',
        },
        msg_type: 'proposal',
        proposal: {
            tick_size_barrier: 0.000409,
            ticks_count_since_loss_condition: 13,
            max_duration_ticks: 10, // = tick_count in proposal_open_contract
            max_payout: 0,
            high_barrier: 8970.04,
            low_barrier: 8930.04,
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
                    value: '8745.01',
                },
            },
            longcode:
                'Win payout when every tick of your contract is within ± 0.1 % of the previous tick in Volatility 100 Index.',
            growth_rate: 0.01,
            payout: 27.45,
            spot: 8768.32,
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
