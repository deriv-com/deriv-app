import { expectValue } from '../../../shared';
import { translate }   from '../../../../utils/lang/i18n';

Blockly.Blocks.emaa_statement = {
    protected_statements : ['STATEMENT'],
    required_child_blocks: ['input_list', 'period'],
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: translate('set %1 to Exponentional Moving Average Array %2'),
            message1: '%1',
            args0   : [
                {
                    type    : 'field_variable',
                    name    : 'VARIABLE',
                    variable: 'emaa',
                },
                {
                    type: 'input_dummy',
                },
            ],
            args1: [
                {
                    type : 'input_statement',
                    name : 'STATEMENT',
                    check: null,
                },
            ],
            colour           : Blockly.Colours.Base.colour,
            colourSecondary  : Blockly.Colours.Base.colourSecondary,
            colourTertiary   : Blockly.Colours.Base.colourTertiary,
            tooltip          : translate('Calculates Exponential Moving Average (EMA) list from a list of values with a period'),
            previousStatement: null,
            nextStatement    : null,
            category         : Blockly.Categories.Indicators,
        };
    },
    meta() {
        return {
            'display_name': translate('Exponential Moving Average Array (EMAA)'),
            'description' : translate('Similar to EMA. This block gives you the entire EMA line based on the input list and the given period.'),
        };
    },
    onchange: Blockly.Blocks.bb_statement.onchange,
};

Blockly.JavaScript.emaa_statement = block => {
    // eslint-disable-next-line no-underscore-dangle
    const varName = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VARIABLE'),
        Blockly.Variables.NAME_TYPE
    );
    const input = expectValue(block.getChildByType('input_list'), 'INPUT_LIST');
    const period = block.childValueToCode('period', 'PERIOD') || '10';

    const code = `${varName} = Bot.emaa(${input}, ${period});\n`;
    return code;
};
