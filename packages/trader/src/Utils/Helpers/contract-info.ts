import { TContractInfo } from '@deriv/shared';

const createContractInfo = (obj: Partial<TContractInfo> = {}): TContractInfo => {
    return {
        account_id: 84780920,
        // audit_details: {
        //     all_ticks: [
        //         { epoch: 1700482764, tick: 2428.58, tick_display_value: '2428.58' },
        //         {
        //             epoch: 1700482765,
        //             flag: 'highlight_time',
        //             name: 'Start Time',
        //             tick: 2428.77,
        //             tick_display_value: '2428.77',
        //         },
        //         {
        //             epoch: 1700482766,
        //             flag: 'highlight_tick',
        //             name: 'Entry Spot',
        //             tick: 2428.68,
        //             tick_display_value: '2428.68',
        //         },
        //         { epoch: 1700482767, tick: 2428.86, tick_display_value: '2428.86' },
        //         { epoch: 1700482768, tick: 2429.18, tick_display_value: '2429.18' },
        //         { epoch: 1700482769, tick: 2429.51, tick_display_value: '2429.51' },
        //         { epoch: 1700482770, tick: 2429.17, tick_display_value: '2429.17' },

        //         { epoch: 1700482771, tick: 2429.42, tick_display_value: '2429.42' },
        //         { epoch: 1700482772, tick: 2429.13, tick_display_value: '2429.13' },
        //         { epoch: 1700482773, tick: 2429.36, tick_display_value: '2429.36' },
        //         { epoch: 1700482774, tick: 2429.36, tick_display_value: '2429.36' },
        //         { epoch: 1700482775, tick: 2428.99, tick_display_value: '2428.99' },

        //         {
        //             epoch: 1700482776,
        //             flag: 'highlight_tick',
        //             name: 'End Time and Exit Spot',
        //             tick: 2428.65,
        //             tick_display_value: '2428.65',
        //         },
        //         { epoch: 1700482777, tick: 2428.95, tick_display_value: '2428.95' },
        //     ],
        // },
        // barrier: 2428.68,
        barrier_count: 1,
        // [Only for accumulator] Absolute difference between high/low barrier and spot
        // barrier_spot_distance?: string;
        bid_price: 19.32,
        buy_price: 10,
        // Contains information about contract cancellation option.
        // cancellation?: {
        //   ask_price?: number;
        //   date_expiry?: number;
        // };
        // commision?: null | number;
        contract_id: 224304409908,
        contract_type: 'CALL',
        currency: 'USD',
        current_spot: 2415.18,
        current_spot_display_value: '2415.18',
        // [Applicable for accumulator] High barrier based on current spot.
        // current_spot_high_barrier?: string;
        // [Applicable for accumulator] Low barrier based on current spot.
        // current_spot_low_barrier?: string;
        current_spot_time: 1700481935,
        date_expiry: 1700482235,
        date_settlement: 1700482235,
        date_start: 1700481935,
        display_name: 'Volatility 100 (1s) Index',
        // [Only for vanilla or turbos options] The implied number of contracts
        // display_number_of_contracts?: string;
        // display_value?: string;
        // entry_spot: 2428.68,
        // entry_spot_display_value: "2428.68",
        // entry_tick: 2428.68,
        // entry_tick_display_value: "2428.68",
        // entry_tick_time: 1700482766,
        // exit_tick: 2428.65,
        // exit_tick_display_value: '2428.65',
        // exit_tick_time: 1700482776,
        expiry_time: 1700482235,
        // [Only for accumulator] Growth rate of an accumulator contract.
        // growth_rate?: number;
        // High barrier of the contract (if any).
        // high_barrier?: string;
        id: '1498e9ed-ef07-a793-76aa-4bee79cab438',
        is_expired: 0,
        is_forward_starting: 0,
        is_intraday: 1,
        is_path_dependent: 0,
        is_settleable: 0,
        is_sold: 0,
        is_valid_to_cancel: 0,
        is_valid_to_sell: 0,
        //  Orders are applicable to `MULTUP` and `MULTDOWN` contracts only.
        // limit_order?: {
        //   stop_loss?: {
        //     display_name?: string;
        //     order_amount?: null | number;
        //     order_date?: number;
        //     value?: null | string;
        //   };
        //   stop_out?: {
        //     display_name?: string;
        //     order_amount?: number;
        //     order_date?: number;
        //     value?: string;
        //   };
        //   take_profit?: {
        //     display_name?: string;
        //     order_amount?: null | number;
        //     order_date?: number;
        //     value?: null | string;
        //   };
        // };
        longcode:
            'Win payout if Volatility 100 (1s) Index is strictly higher than entry spot at 5 minutes after contract start time.',
        // low_barrier?: string;
        // [Only for lookback trades] Multiplier applies when calculating the final payoff for each type of lookback. e.g. (Exit spot - Lowest historical price) * multiplier = Payout
        // multiplier?: number;
        // [Only for vanilla or turbos options] The implied number of contracts
        // number_of_contracts?: number;
        payout: 19.55,
        profit: 9.32,
        profit_percentage: 93.2,
        purchase_time: 1700481935,
        // [Only for reset trades i.e. RESETCALL and RESETPUT] Reset barrier of the contract.
        // reset_barrier?: null | string;
        // [Only for reset trades i.e. RESETCALL and RESETPUT] The epoch time of a barrier reset.
        // reset_time?: number;
        // sell_price: 0,
        // sell_spot: 2428.65,
        // sell_spot_display_value: "2428.65",
        // sell_spot_time: 1700482776,
        // sell_time: 1700482777,
        shortcode: 'CALL_1HZ100V_19.55_1700481935_1700482235_S0P_0',
        status: 'open',
        // tick_count: 10,
        // [Only for accumulator] Number of ticks passed since entry_tick
        // tick_passed?: number;
        // tick_stream?: [{epoch:1700482766, tick:2428.68, tick_display_value:'2428.68'},{epoch:1700482767, tick:2428.86, tick_display_value:'2428.86'}],
        transaction_ids: {
            buy: 447576512008,
            // sell: 447578592228
        },
        underlying: '1HZ100V',
        validation_error: 'Waiting for entry tick.',
        validation_error_code: 'General',
        ...obj,
    };
};

export default createContractInfo;
