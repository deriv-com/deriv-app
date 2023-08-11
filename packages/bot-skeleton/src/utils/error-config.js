export const error_message_map = {
    trade_definition: "'Define your trade contract' block should be added to the workspace.",
    trade_parameters: "'Define your trade contract' block should be added to the workspace.",
    before_purchase: "'Watch and purchase your contract' block should be added to the workspace.",
    purchase_conditions: "'Watch and purchase your contract' block should be added to the workspace.",
    after_purchase: {
        missing: 'Restart trading conditions block is missing from workspace.',
        misplaced: 'Restart trading conditions block is misplaced from workspace.',
        default: "'After purchase your contract' block should be added to the workspace.",
    },
    trade_results: {
        missing: 'Restart trading conditions block is missing from workspace.',
        misplaced: 'Restart trading conditions block is misplaced from workspace.',
        default: 'Restart trading conditions block cannot be deleted.',
    },
    purchase: {
        missing: 'Purchase block is missing from purchase conditions.',
        misplaced: 'Purchase block is misplaced from purchase conditions.',
    },
    trade_definition_tradeoptions: {
        missing: 'Trade options are missing from trade parameters block.',
        misplaced: 'Trade options are misplaced from trade parameters block.',
    },
    trade_definition_multiplier: {
        missing: 'Trade options multipliers are missing from trade parameters block.',
        misplaced: 'Trade options multipliers options are misplaced from trade parameters block.',
    },
    trade_again: {
        missing: 'Trade again is missing from trade parameters block.',
        misplaced: 'Trade again is misplaced from trade parameters block.',
    },
};
