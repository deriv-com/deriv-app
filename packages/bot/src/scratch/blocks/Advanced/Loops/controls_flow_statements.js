import { translate } from '../../../../utils/lang/i18n';

Blockly.Blocks.controls_flow_statements = {
    init() {
        this.jsonInit(this.definition());
    },
    definition(){
        return {
            message0: translate('%1 of loop'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'FLOW',
                    options: [
                        [translate('break out'), 'BREAK'],
                        [translate('continue with next iteration'), 'CONTINUE'],
                    ],
                },
            ],
            colour           : Blockly.Colours.Utility.colour,
            colourSecondary  : Blockly.Colours.Utility.colourSecondary,
            colourTertiary   : Blockly.Colours.Utility.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
            tooltip          : translate('Allows to exit the loop or jump to the next iteration'),
            category         : Blockly.Categories.Loop,
        };
    },
    meta(){
        return {
            'display_name': translate('Break out/continue'),
            'description' : translate('This block is used to terminate or continue a loop, and can be placed anywhere within a loop block. Clicking on “break out” gives you two options: break out (terminates the loop), or continue with next iteration.'),
        };
    },
};

Blockly.JavaScript.controls_flow_statements = block => {
    const keyword = block.getFieldValue('FLOW') === 'BREAK' ? 'break' : 'continue';
    return `${keyword};\n`;
};
