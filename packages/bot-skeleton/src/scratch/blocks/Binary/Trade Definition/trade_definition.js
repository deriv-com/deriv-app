import { localize } from '@deriv/translations';
// import { defineContract } from '../../images';
import DBotStore from '../../../dbot-store';
import { runIrreversibleEvents } from '../../../utils';
import { removeErrorHandlingEventListener, initErrorHandlingListener } from '../../../../utils';
import { config } from '../../../../constants/config';

goog.provide('Blockly.Blocks.colour');

goog.require('Blockly.Blocks');

goog.require('Blockly.constants');

/**
 * Pick a random colour.
 * @return {string} #RRGGBB for random colour.
 */
function randomColour() {
    var num = Math.floor(Math.random() * Math.pow(2, 24));
    return '#' + ('00000' + num.toString(16)).substr(-6);
}

Blockly.Blocks['colour_picker'] = {
    /**
     * Block for colour picker.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_colour_slider",
                    "name": "COLOUR",
                    "colour": randomColour()
                }
            ],
            "outputShape": Blockly.OUTPUT_SHAPE_ROUND,
            "output": "Colour"
        });
    }
};
goog.provide('Blockly.Blocks.math');

goog.require('Blockly.Blocks');

goog.require('Blockly.Colours');

goog.require('Blockly.constants');

Blockly.Blocks['math_number'] = {
    /**
     * Block for generic numeric value.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_number",
                    "name": "NUM",
                    "value": "0"
                }
            ],
            "output": "Number",
            "outputShape": Blockly.OUTPUT_SHAPE_ROUND,
            "colour": Blockly.Colours.textField,
            "colourSecondary": Blockly.Colours.textField,
            "colourTertiary": Blockly.Colours.textField,
            "colourQuaternary": Blockly.Colours.textField
        });
    }
};

Blockly.Blocks['math_integer'] = {
    /**
     * Block for integer value (no decimal, + or -).
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_number",
                    "name": "NUM",
                    "precision": 1
                }
            ],
            "output": "Number",
            "outputShape": Blockly.OUTPUT_SHAPE_ROUND,
            "colour": Blockly.Colours.textField,
            "colourSecondary": Blockly.Colours.textField,
            "colourTertiary": Blockly.Colours.textField,
            "colourQuaternary": Blockly.Colours.textField
        });
    }
};

Blockly.Blocks['math_whole_number'] = {
    /**
     * Block for whole number value, no negatives or decimals.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_number",
                    "name": "NUM",
                    "min": 0,
                    "precision": 1
                }
            ],
            "output": "Number",
            "outputShape": Blockly.OUTPUT_SHAPE_ROUND,
            "colour": Blockly.Colours.textField,
            "colourSecondary": Blockly.Colours.textField,
            "colourTertiary": Blockly.Colours.textField,
            "colourQuaternary": Blockly.Colours.textField
        });
    }
};

Blockly.Blocks['math_positive_number'] = {
    /**
     * Block for positive number value, with decimal.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_number",
                    "name": "NUM",
                    "min": 0
                }
            ],
            "output": "Number",
            "outputShape": Blockly.OUTPUT_SHAPE_ROUND,
            "colour": Blockly.Colours.textField,
            "colourSecondary": Blockly.Colours.textField,
            "colourTertiary": Blockly.Colours.textField,
            "colourQuaternary": Blockly.Colours.textField
        });
    }
};

Blockly.Blocks['math_angle'] = {
    /**
     * Block for angle picker.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_angle",
                    "name": "NUM",
                    "value": 90
                }
            ],
            "output": "Number",
            "outputShape": Blockly.OUTPUT_SHAPE_ROUND,
            "colour": Blockly.Colours.textField,
            "colourSecondary": Blockly.Colours.textField,
            "colourTertiary": Blockly.Colours.textField,
            "colourQuaternary": Blockly.Colours.textField
        });
    }
};

export const defineContract =
    // 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYAgMAAACdGdVrAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAlQTFRFAAAAMzMzMzMzaARWNQAAAAN0Uk5TAID/7PezGAAAACFJREFUeJxjYEAFUqtWLQFSCgwMHDipplXUF0ShoI5ABgDTPwulgF1l+wAAAABJRU5ErkJggg==';
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAAGXcA1uAAAAAXNSR0IArs4c6QAAAK9JREFUSA3tVUkOgCAMROP/f4PfU4iOaWQKLYmBg71AOksXTAyhGkeKKuECjTSDUwcFxVdNawNgQ10omJNKROqiJbMJsKJZgKgEouuESRYVFVxO35JTnxGDvk9aWQ5GCXfSPbRbsLHysr0lBeMESaKE3hkmbKk230SY9Ulky5rG/SVJU8udPrMU5s7w9bEugUlN886MWiJN86/o2dywFQ17g10b+dlJefH9X0t9X+YETM6gfmoeI+MAAAAASUVORK5CYII=';

Blockly.Block.prototype.getBlocksInStatement = function (statementInputName) {
    const blocksInStatement = [];
    const firstBlock = this.getInputTargetBlock(statementInputName);

    if (firstBlock) {
        return firstBlock.getSiblings();
    }
    return blocksInStatement;
};

Blockly.Block.prototype.getSiblings = function () {
    const siblings = [this];
    ['getPreviousBlock', 'getNextBlock'].forEach(functionName => {
        let block = this[functionName]();
        while (block !== null) {
            const parent = this.getParent();
            if (parent && parent.id === block.id) {
                break;
            }

            siblings.push(block);
            block = block[functionName]();
        }
    });
    return siblings;
};
Blockly.Blocks.trade_definition = {
    init() {
        this.jsonInit(this.definition());
        this.setDeletable(false);
        this.isInit = false;
    },
    definition() {
        return {
            message0: '%1 %2 %3',
            message1: '%1',
            message2: '%1 %2 %3',
            message3: '%1',
            message4: '%1 %2 %3',
            message5: '%1',
            args0: [
                {
                    type: 'field_image',
                    src: defineContract,
                    width: 25,
                    height: 25,
                },
                {
                    type: 'field_label',
                    text: localize('1. Trade parameters'),
                    class: 'blocklyTextRootBlockHeader',
                },
                {
                    type: 'input_dummy',
                },
            ],
            args1: [
                {
                    type: 'input_statement',
                    name: 'TRADE_OPTIONS',
                },
            ],
            args2: [
                {
                    type: 'field_image',
                    src: ' ', // this is here to add extra padding
                    width: 4,
                    height: 25,
                },
                {
                    type: 'field_label',
                    text: localize('Run once at start:'),
                    class: 'blocklyTextRootBlockHeader',
                },
                {
                    type: 'input_dummy',
                },
            ],
            args3: [
                {
                    type: 'input_statement',
                    name: 'INITIALIZATION',
                    check: null,
                },
            ],
            args4: [
                {
                    type: 'field_image',
                    src: ' ', // this is here to add extra padding
                    width: 4,
                    height: 25,
                },
                {
                    type: 'field_label',
                    text: localize('Trade options:'),
                    class: 'blocklyTextRootBlockHeader',
                },
                {
                    type: 'input_dummy',
                },
            ],
            args5: [
                {
                    type: 'input_statement',
                    name: 'SUBMARKET',
                },
            ],
            colour: Blockly.Colours.RootBlock.colour,
            colourSecondary: Blockly.Colours.RootBlock.colourSecondary,
            colourTertiary: Blockly.Colours.RootBlock.colourTertiary,
            tooltip: localize('Here is where you define the parameters of your contract.'),
            category: Blockly.Categories.Trade_Definition,
        };
    },
    meta() {
        return {
            display_name: localize('Trade parameters'),
            description: localize('Here is where you define the parameters of your contract.'),
            key_words: localize('market, trade type, contract type'),
        };
    },
    onchange(event) {
        if (event.type === 'ui' && !this.isInit) {
            this.isInit = true;
            initErrorHandlingListener('keydown');
        } else if (Blockly.selected === null && this.isInit) {
            this.isInit = false;
            removeErrorHandlingEventListener('keydown');
        }
        if (!this.workspace || this.workspace.isDragging() || this.isInFlyout) {
            return;
        }

        if (event.type === Blockly.Events.BLOCK_CHANGE || event.type === Blockly.Events.END_DRAG) {
            // Enforce only trade_definition_<type> blocks in TRADE_OPTIONS statement.
            const blocks_in_trade_options = this.getBlocksInStatement('TRADE_OPTIONS');

            if (blocks_in_trade_options.length > 0) {
                blocks_in_trade_options.forEach(block => {
                    if (!/^trade_definition_.+$/.test(block.type)) {
                        runIrreversibleEvents(() => {
                            block.unplug(true);
                        });
                    }
                });
            } else {
                runIrreversibleEvents(() => {
                    this.dispose();
                });
            }
        }
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock['trade_definition'] = block => {
    const { client } = DBotStore.instance;

    if (!client || !client.is_logged_in) {
        throw new Error('Please login');
    }

    const { loginid } = client;
    const account = client.getToken(loginid);
    const market_block = block.getChildByType('trade_definition_market');
    const trade_type_block = block.getChildByType('trade_definition_tradetype');
    const contract_type_block = block.getChildByType('trade_definition_contracttype');
    const candle_interval_block = block.getChildByType('trade_definition_candleinterval');
    const restart_on_error_block = block.getChildByType('trade_definition_restartonerror');
    const restart_on_buy_sell_block = block.getChildByType('trade_definition_restartbuysell');

    const symbol = market_block.getFieldValue('SYMBOL_LIST');
    const trade_type = trade_type_block.getFieldValue('TRADETYPE_LIST');
    const contract_type = contract_type_block.getFieldValue('TYPE_LIST');
    const candle_interval = candle_interval_block.getFieldValue('CANDLEINTERVAL_LIST');
    const should_restart_on_error = restart_on_error_block.getFieldValue('RESTARTONERROR') !== 'FALSE';
    const should_restart_on_buy_sell = restart_on_buy_sell_block.getFieldValue('TIME_MACHINE_ENABLED') !== 'FALSE';

    const { opposites } = config;
    const contract_type_list =
        contract_type === 'both'
            ? opposites[trade_type.toUpperCase()].map(opposite => Object.keys(opposite)[0])
            : [contract_type];

    const initialization = Blockly.JavaScript.javascriptGenerator.statementToCode(block, 'INITIALIZATION');
    const trade_options_statement = Blockly.JavaScript.javascriptGenerator.statementToCode(block, 'SUBMARKET');

    const code = `  
    BinaryBotPrivateInit = function BinaryBotPrivateInit() {
        Bot.init('${account}', {
          symbol              : '${symbol}',
          contractTypes       : ${JSON.stringify(contract_type_list)},
          candleInterval      : '${candle_interval || 'FALSE'}',
          shouldRestartOnError: ${should_restart_on_error},
          timeMachineEnabled  : ${should_restart_on_buy_sell},
        });
        ${initialization.trim()}
    };
      BinaryBotPrivateStart = function BinaryBotPrivateStart() {
        BinaryBotPrivateHasCalledTradeOptions = false;
        Bot.highlightBlock('${block.id}');
        ${trade_options_statement.trim()}
      };\n`;
    return code;
};
