import { localize } from '@deriv/translations';

export const error_message_map = {
    trade_parameters: localize("'Define your trade contract' block should be added to the workspace."),
    purchase_conditions: localize("'Watch and purchase your contract' block should be added to the workspace"),
    sell_conditions: localize('Sell conditions block cannot be deleted'),
    purchase: {
        missing: localize('Purchase block is missing from purchase conditions'),
        misplaced: localize('Purchase block is misplaced from purchase conditions'),
    },
    trade_definition_tradeoptions: {
        missing: localize('Trade options are missing from trade parameters block'),
        misplaced: localize('Trade options are misplaced from trade parameters block'),
    },
};
