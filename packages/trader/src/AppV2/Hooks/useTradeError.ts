import React from 'react';

import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';
import { useTraderStore } from 'Stores/useTraderStores';

export type TErrorFields = 'take_profit' | 'stop_loss' | 'date_start' | 'stake' | 'amount';

const useTradeError = ({ error_fields }: { error_fields: TErrorFields[] }) => {
    const { contract_type, proposal_info, validation_errors, trade_type_tab, trade_types } = useTraderStore();
    const contract_types = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);

    const {
        has_error: proposal_has_error,
        error_field: proposal_error_field,
        message: proposal_error_message,
    } = proposal_info?.[contract_types[0]] ?? {};

    const checkErrorForField = (field: TErrorFields) => {
        const validation_has_error = validation_errors?.[field]?.length > 0;
        const is_error_matching_field = (proposal_has_error && proposal_error_field === field) || validation_has_error;

        const message = proposal_error_message ?? validation_errors?.[field]?.[0] ?? '';

        return { is_error_matching_field, message };
    };

    const error = error_fields
        .map(field => checkErrorForField(field)) // Mapping each param to its error result
        .find(result => result.is_error_matching_field); // Find the first match

    // If an error was found, return the error; otherwise return no error
    return error || { is_error_matching_field: false, message: '' };
};

export default useTradeError;
