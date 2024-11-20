import React from 'react';
import { useTraderStore } from 'Stores/useTraderStores';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';

export type TTradeParams = 'take_profit' | 'stop_loss';

const useTradeParamError = ({ trade_params }: { trade_params: TTradeParams[] }) => {
    const { contract_type, proposal_info, validation_errors, trade_type_tab, trade_types } = useTraderStore();
    const contract_types = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);

    const {
        has_error: proposal_has_error,
        error_field: proposal_error_field,
        message: proposal_error_message,
    } = proposal_info?.[contract_types[0]] ?? {};

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
