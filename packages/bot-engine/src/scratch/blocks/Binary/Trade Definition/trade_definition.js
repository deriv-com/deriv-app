import { localize }          from 'deriv-translations';
import { defineContract }    from '../../images';
import { setBlockTextColor } from '../../../utils';
import { client }            from '../../../../services/tradeEngine/utils/user';
import { config }            from '../../../../constants/config';

Blockly.Blocks.trade_definition = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('%1 1. Trade parameters %2'),
            message1: '%1',
            message2: localize('%1Run once at start: %2'),
            message3: '%1',
            message4: localize('%1Trade options: %2'),
            message5: '%1',
            args0   : [
                {
                    type  : 'field_image',
                    src   : defineContract,
                    width : 25,
                    height: 25,
                    alt   : 'T',
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
                    type  : 'field_image',
                    src   : '', // this is here to add extra padding
                    width : 4,
                    height: 25,
                },
                {
                    type: 'input_dummy',
                },
            ],
            args3: [
                {
                    type : 'input_statement',
                    name : 'INITIALIZATION',
                    check: null,
                },
            ],
            args4: [
                {
                    type  : 'field_image',
                    src   : '', // this is here to add extra padding
                    width : 4,
                    height: 25,
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
            colour         : Blockly.Colours.RootBlock.colour,
            colourSecondary: Blockly.Colours.RootBlock.colourSecondary,
            colourTertiary : Blockly.Colours.RootBlock.colourTertiary,
            tooltip        : localize('Here is where you define the parameters of your contract.'),
            category       : Blockly.Categories.Trade_Definition,
        };
    },
    meta() {
        return {
            'display_name': localize('Trade parameters'),
            'description' : localize('Here is where you define the parameters of your contract.'),
        };
    },
    onchange(event) {
        //        if (!ScratchStore.instance.root_store.core.ui.is_dark_mode_on) {
        // TODO: incomment this when the dark mode is done
        setBlockTextColor(this);
        //        }

        if (!this.workspace || this.isInFlyout) {
            return;
        }

        if (event.type === Blockly.Events.BLOCK_CREATE && event.ids.includes(this.id)) {
            // Maintain single instance of this block, dispose of older ones.
            const top_blocks = this.workspace.getTopBlocks(false);

            top_blocks.forEach(top_block => {
                if (top_block.type === this.type && top_block.id !== this.id) {
                    top_block.dispose(false);
                }
            });
        } else if (event.type === Blockly.Events.BLOCK_CHANGE || event.type === Blockly.Events.END_DRAG) {
            // Enforce only trade_definition_<type> blocks in TRADE_OPTIONS statement.
            const blocks_in_trade_options = this.getBlocksInStatement('TRADE_OPTIONS');

            blocks_in_trade_options.forEach(block => {
                if (!/^trade_definition_.+$/.test(block.type)) {
                    Blockly.Events.disable();
                    block.unplug(true);
                    Blockly.Events.enable();
                }
            });
        }
    },
};

Blockly.JavaScri = block => {
    
    if (!client.is_logged_in) {
        throw new Error('Please login');
    }

    const { token: account }         = client;
    
    const market_block               = block.getChildByType('trade_definition_market');
    const trade_type_block           = block.getChildByType('trade_definition_tradetype');
    const contract_type_block        = block.getChildByType('trade_definition_contracttype');
    const candle_interval_block      = block.getChildByType('trade_definition_candleinterval');
    const restart_on_error_block     = block.getChildByType('trade_definition_restartonerror');
    const restart_on_buy_sell_block  = block.getChildByType('trade_definition_restartbuysell');

    const symbol                     = market_block.getFieldValue('SYMBOL_LIST');
    const trade_type                 = trade_type_block.getFieldValue('TRADETYPE_LIST');
    const contract_type              = contract_type_block.getFieldValue('TYPE_LIST');
    const candle_interval            = candle_interval_block.getFieldValue('CANDLEINTERVAL_LIST');
    const should_restart_on_error    = restart_on_error_block.getFieldValue('RESTARTONERROR');
    const should_restart_on_buy_sell = restart_on_buy_sell_block.getFieldValue('TIME_MACHINE_ENABLED');

    const { opposites }              = config;
    const contract_type_list         = contract_type === 'both'
        ? opposites[trade_type.toUpperCase()].map(opposite => Object.keys(opposite)[0])
        : [contract_type];

    const initialization             = Blockly.JavaScript.statementToCode(block, 'INITIALIZATION');
    const trade_options_statement    = Blockly.JavaScript.statementToCode(block, 'SUBMARKET');

    const code = `  
    BinaryBotPrivateInit = function BinaryBotPrivateInit() {
        Bot.init('${account}', {
          symbol              : '${symbol}',
          contractTypes       : ${JSON.stringify(contract_type_list)},
          candleInterval      : '${candle_interval || 'FALSE'}',
          shouldRestartOnError: '${should_restart_on_error}',
          timeMachineEnabled  : '${should_restart_on_buy_sell}',
        });
        ${initialization.trim()}
    };
      BinaryBotPrivateStart = function BinaryBotPrivateStart() {
        ${trade_options_statement.trim()}
      };\n`;
    return code;
};
