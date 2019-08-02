import { lazy } from 'react';
import { translate } from '../../../utils/lang/i18n';

Blockly.Blocks.math_random_float = {
    init() {
        this.jsonInit({
            message0       : translate('random fraction'),
            output         : 'Number',
            outputShape    : Blockly.OUTPUT_SHAPE_ROUND,
            colour         : Blockly.Colours.Binary.colour,
            colourSecondary: Blockly.Colours.Binary.colourSecondary,
            colourTertiary : Blockly.Colours.Binary.colourTertiary,
        });
    },
    helpContent: () => lazy(() => import('../../help-components/Math/math_random_float.jsx')),
};

Blockly.JavaScript.math_random_float = () => ['Math.random()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
