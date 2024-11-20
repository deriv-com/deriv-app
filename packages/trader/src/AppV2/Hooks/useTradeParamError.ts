import React from 'react';
import { useTraderStore } from 'Stores/useTraderStores';

export type TTradeParams = 'take_profit' | 'stop_loss';

const useTradeParamError = ({
    contract_type,
    proposal_info,
    trade_params,
    validation_errors,
}: {
    contract_type: string;
    proposal_info: ReturnType<typeof useTraderStore>['proposal_info'];
    trade_params: TTradeParams[];
    validation_errors: ReturnType<typeof useTraderStore>['validation_errors'];
}) => {
    const {
        has_error: proposal_has_error,
        error_field: proposal_error_field,
        message: proposal_error_message,
    } = proposal_info?.[contract_type] ?? {};

    const checkErrorForParam = (param: TTradeParams) => {
        const validation_has_error = validation_errors?.[param]?.length > 0;
        const is_error_matching_trade_param =
            (proposal_has_error && proposal_error_field === param) || validation_has_error;

        const message = proposal_error_message ?? validation_errors?.[param]?.[0] ?? '';

        return { is_error_matching_trade_param, message };
    };

    const error = trade_params
        .map(param => checkErrorForParam(param)) // Mapping each param to its error result
        .find(result => result.is_error_matching_trade_param); // Find the first match

    // If an error was found, return the error; otherwise return no error
    return error || { is_error_matching_trade_param: false, message: '' };
};

export default useTradeParamError;
