import { localize } from '@deriv/translations';

const generateErrorMessage = (block_type, missing_space = localize('workspace')) => {
    return {
        missing: localize('The {{block_type}} block is missing.', {
            block_type,
        }),
        misplaced: localize('The {{block_type}} block is misplaced from {{missing_space}}.', {
            block_type,
            missing_space,
        }),
        disabled: localize('The {{block_type}} block is mandatory and cannot be deleted/disabled.', {
            block_type,
        }),
        default: localize('The {{block_type}} block is mandatory and cannot be deleted/disabled.', {
            block_type,
        }),
    };
};

export const error_message_map = {
    trade_definition: generateErrorMessage(localize('Trade parameters')),
    trade_parameters: generateErrorMessage(localize('Trade parameters')),
    before_purchase: generateErrorMessage(localize('Purchase conditions')),
    purchase_conditions: generateErrorMessage(localize('Purchase conditions')),
    purchase: generateErrorMessage(localize('Purchase'), localize('purchase conditions')),
    trade_definition_tradeoptions: generateErrorMessage(localize('Trade options'), localize('trade parameters')),
    trade_definition_multiplier: generateErrorMessage(
        localize('Trade options multipliers'),
        localize('trade parameters')
    ),
    trade_definition_accumulator: generateErrorMessage(
        localize('Trade options accumulators'),
        localize('trade parameters')
    ),
};
