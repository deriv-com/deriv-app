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
            colour           : Blockly.Colours.Binary.colour,
            colourSecondary  : Blockly.Colours.Binary.colourSecondary,
            colourTertiary   : Blockly.Colours.Binary.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
            tooltip          : translate('Control Statement Tooltip'),
            category         : Blockly.Categories.Loop,
        };
    },
    meta(){
        return {
            'display_name': translate('Control Statement'),
            'description' : translate('Control Statement Description'),
        };
    },
};

Blockly.JavaScript.controls_flow_statements = block => {
    const keyword = block.getFieldValue('FLOW') === 'BREAK' ? 'break' : 'continue';
    return `${keyword};\n`;
};
