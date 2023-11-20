import { TContractInfo } from '@deriv/shared';

export function createContractInfo(obj: Partial<TContractInfo>): TContractInfo {
    return {
        // account_id?: number;
        // audit_details?: AuditDetailsForExpiredContract;
        // barrier?: null | string;
        // barrier_count?: number;
        // /**
        //  * [Only for accumulator] Absolute difference between high/low barrier and spot
        //  */
        // barrier_spot_distance?: string;
        // bid_price?: number;
        // buy_price?: number;
        // /**
        //  * Contains information about contract cancellation option.
        //  */
        // cancellation?: {
        //   /**
        //    * Ask price of contract cancellation option.
        //    */
        //   ask_price?: number;
        //   /**
        //    * Expiry time in epoch for contract cancellation option.
        //    */
        //   date_expiry?: number;
        // };
        // /**
        //  * Commission in payout currency amount.
        //  */
        // commision?: null | number;
        // contract_id?: number;
        // contract_type?: string;
        // currency?: string;
        // current_spot?: number;
        // current_spot_display_value?: string;
        // /**
        //  * [Applicable for accumulator] High barrier based on current spot.
        //  */
        // current_spot_high_barrier?: string;
        // /**
        //  * [Applicable for accumulator] Low barrier based on current spot.
        //  */
        // current_spot_low_barrier?: string;
        // current_spot_time?: number;
        // date_expiry?: number;
        // date_settlement?: number;
        // date_start?: number;
        // display_name?: string;
        // /**
        //  * [Only for vanilla or turbos options] The implied number of contracts
        //  */
        // display_number_of_contracts?: string;
        // display_value?: string;
        // entry_spot?: null | number;
        // entry_spot_display_value?: null | string;
        // entry_tick?: number;
        // entry_tick_display_value?: string;
        // entry_tick_time?: number;
        // exit_tick?: number;
        // exit_tick_display_value?: string;
        // exit_tick_time?: number;
        // expiry_time?: number;
        // /**
        //  * [Only for accumulator] Growth rate of an accumulator contract.
        //  */
        // growth_rate?: number;
        // /**
        //  * High barrier of the contract (if any).
        //  */
        // high_barrier?: string;
        // /**
        //  * A per-connection unique identifier. Can be passed to the `forget` API call to unsubscribe.
        //  */
        // id?: string;
        // is_expired?: 0 | 1;
        // /**
        //  * Whether the contract is forward-starting or not.
        //  */
        // is_forward_starting?: 0 | 1;
        // /**
        //  * Whether the contract is an intraday contract.
        //  */
        // is_intraday?: 0 | 1;
        // /**
        //  * Whether the contract expiry price will depend on the path of the market (e.g. One Touch contract).
        //  */
        // is_path_dependent?: 0 | 1;
        // /**
        //  * Whether the contract is settleable or not.
        //  */
        // is_settleable?: 0 | 1;
        // is_sold?: 0 | 1;
        // /**
        //  * Whether the contract can be cancelled.
        //  */
        // is_valid_to_cancel?: 0 | 1;
        // /**
        //  * Whether the contract can be sold back to the company.
        //  */
        // is_valid_to_sell?: 0 | 1;
        // /**
        //  * Orders are applicable to `MULTUP` and `MULTDOWN` contracts only.
        //  */
        // limit_order?: {
        //   /**
        //    * Contains information where the contract will be closed automatically at the loss specified by the user.
        //    */
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
        // longcode?: string;
        // /**
        //  * Low barrier of the contract (if any).
        //  */
        // low_barrier?: string;
        // /**
        //  * [Only for lookback trades] Multiplier applies when calculating the final payoff for each type of lookback. e.g. (Exit spot - Lowest historical price) * multiplier = Payout
        //  */
        // multiplier?: number;
        // /**
        //  * [Only for vanilla or turbos options] The implied number of contracts
        //  */
        // number_of_contracts?: number;
        // payout?: number;
        // profit?: number;
        // profit_percentage?: number;
        // purchase_time?: number;
        // /**
        //  * [Only for reset trades i.e. RESETCALL and RESETPUT] Reset barrier of the contract.
        //  */
        // reset_barrier?: null | string;
        // /**
        //  * [Only for reset trades i.e. RESETCALL and RESETPUT] The epoch time of a barrier reset.
        //  */
        // reset_time?: number;
        // sell_price?: number;
        // sell_spot?: number;
        // sell_spot_display_value?: string;
        // sell_spot_time?: number;
        // sell_time?: number | null;
        // shortcode?: string;
        // status?: ContractStatus;
        // tick_count?: number;
        // /**
        //  * [Only for accumulator] Number of ticks passed since entry_tick
        //  */
        // tick_passed?: number;
        // tick_stream?: {
        //   epoch?: number;
        //   tick?: null | number;
        //   tick_display_value?: null | string;
        // }[];
        // transaction_ids?: TransactionIdsForContract;
        // underlying?: string;
        // validation_error?: string;
        // validation_error_code?: string;
        ...obj,
    };
}
