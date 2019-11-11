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
            colour           : Blockly.Colours.Base.colour,
            colourSecondary  : Blockly.Colours.Base.colourSecondary,
            colourTertiary   : Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
            tooltip          : translate('This block is used to either terminate or continue a loop, and can be placed anywhere within a loop block.'),
            category         : Blockly.Categories.Loop,
        };
    },
    meta(){
        return {
            'display_name': translate('Break out/continue'),
            'description' : translate('This block is used to either terminate or continue a loop, and can be placed anywhere within a loop block.'),
        };
    },
};

Blockly.JavaScript.controls_flow_statements = block => {
    const keyword = block.getFieldValue('FLOW') === 'BREAK' ? 'break' : 'continue';
    return `${keyword};\n`;
};
