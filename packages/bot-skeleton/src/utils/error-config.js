import { localize } from '@deriv/translations';

export const error_message_map = {
    trade_definition: localize("'Define your trade contract' block should be added to the workspace."),
    trade_parameters: localize("'Define your trade contract' block should be added to the workspace."),
    before_purchase: localize("'Watch and purchase your contract' block should be added to the workspace."),
    purchase_conditions: localize("'Watch and purchase your contract' block should be added to the workspace."),
    after_purchase: {
        missing: localize('Restart trading conditions block is missing from workspace.'),
        misplaced: localize('Restart trading conditions block is misplaced from workspace.'),
        default: localize("'After purchase your contract' block should be added to the workspace."),
    },
    trade_results: {
        missing: localize('Restart trading conditions block is missing from workspace.'),
        misplaced: localize('Restart trading conditions block is misplaced from workspace.'),
        default: localize('Restart trading conditions block cannot be deleted.'),
    },
    purchase: {
        missing: localize('Purchase block is missing from purchase conditions.'),
        misplaced: localize('Purchase block is misplaced from purchase conditions.'),
    },
    trade_definition_tradeoptions: {
        missing: localize('Trade options are missing from trade parameters block.'),
        misplaced: localize('Trade options are misplaced from trade parameters block.'),
    },
    trade_definition_multiplier: {
        missing: localize('Trade options multipliers are missing from trade parameters block.'),
        misplaced: localize('Trade options multipliers options are misplaced from trade parameters block.'),
    },
    trade_again: {
        missing: localize('Trade again is missing from trade parameters block.'),
        misplaced: localize('Trade again is misplaced from trade parameters block.'),
    },
};
