import { localize } from 'deriv-translations';

Blockly.Blocks.math_number_positive = {
    init      : Blockly.Blocks.math_number.init,
    definition: Blockly.Blocks.math_number.definition,
    meta() {
        return {
            'display_name': localize('Math Number Positive'),
            'description' : localize('Math Number Description'),
        };
    },
    numberValidator(input) {
        if (/^([0][,.]|[1-9]+[,.])?([0]|[1-9])*$/.test(input)) {
            return undefined;
        }
        return null;
    },
};

Blockly.JavaScript.math_number_positive = Blockly.JavaScript.math_number;
