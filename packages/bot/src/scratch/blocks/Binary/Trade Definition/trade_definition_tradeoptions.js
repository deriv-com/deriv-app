import config        from '../../../../constants';
import ApiHelpers    from '../../../../services/api/api-helpers';
import { translate } from '../../../../utils/lang/i18n';

Blockly.Blocks.trade_definition_tradeoptions = {
    init() {
        this.jsonInit(this.definition());

        // Ensure one of this type per statement-stack
        this.setNextStatement(false);
    },
    definition(){
        return {
            message0: translate('Duration: %1 %2 Stake: %3 %4'),
            args0   : [
                {
                    type   : 'field_dropdown',
                    name   : 'DURATIONTYPE_LIST',
                    options: [['', '']],
                },
                {
                    type: 'input_value',
                    name: 'DURATION',
                },
                {
                    type   : 'field_dropdown',
                    name   : 'CURRENCY_LIST',
                    options: config.lists.CURRENCY,
                },
                {
                    type : 'input_value',
                    name : 'AMOUNT',
                    check: 'Number',
                },
            ],
            colour           : Blockly.Colours.BinaryLessPurple.colour,
            colourSecondary  : Blockly.Colours.Binary.colourSecondary,
            colourTertiary   : Blockly.Colours.BinaryLessPurple.colourTertiary,
            previousStatement: null,
            nextStatement    : null,
            tooltip          : translate('Trade Options Tooltip'),
            category         : Blockly.Categories.Trade_Definition,
        };
    },
    meta(){
        return {
            'display_name': translate('Trade Options'),
            'description' : translate('Trade Options Description'),
        };
    },
    onchange(event) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        const top_parent_block = this.getTopParent();

        if (!top_parent_block) {
            return;
        }

        const market_block                = top_parent_block.getChildByType('trade_definition_market');
        const trade_type_block            = top_parent_block.getChildByType('trade_definition_tradetype');

        this.selected_symbol              = market_block.getFieldValue('SYMBOL_LIST');
        this.selected_trade_type_category = trade_type_block.getFieldValue('TRADETYPECAT_LIST');
        this.selected_trade_type          = trade_type_block.getFieldValue('TRADETYPE_LIST');
        this.selected_duration            = this.getFieldValue('DURATIONTYPE_LIST');
        this.selected_barrier_types       = [
            this.getFieldValue('BARRIERTYPE_LIST') || config.BARRIER_TYPES[0][1],
            this.getFieldValue('SECONDBARRIERTYPE_LIST') || config.BARRIER_TYPES[1][1],
        ];

        if (!this.selected_symbol) {
            return;
        }

        if (event.type === Blockly.Events.BLOCK_CREATE && event.ids.includes(this.id)) {
            this.updateBarrierInputs(true);
            this.enforceSingleBarrierType('BARRIERTYPE_LIST', true);
            this.updateDurationInput(true);
            this.updatePredictionInput();
        } else if (event.type === Blockly.Events.BLOCK_CHANGE) {
            if (event.name === 'DURATIONTYPE_LIST') {
                // Update barrier suggested values when changing duration unit.
                this.updateBarrierInputs(true);
                this.enforceSingleBarrierType('BARRIERTYPE_LIST', true);
                // Update duration minimum amount when changing duration unit.
                this.updateDurationInput(false);
            } else if (event.name === 'BARRIERTYPE_LIST' || event.name === 'SECONDBARRIERTYPE_LIST') {
                // Update barrier suggested values when changing barrier type.
                this.updateBarrierInputs(false);
                this.enforceSingleBarrierType(event.name, false);
            } else if (
                event.name === 'SYMBOL_LIST' ||
                event.name === 'TRADETYPECAT_LIST' ||
                event.name === 'TRADETYPE_LIST'
            ) {
                // Update durations, barriers, and prediction when changing the trade type.
                this.updateBarrierInputs(true);
                this.enforceSingleBarrierType('BARRIERTYPE_LIST', true);
                this.updateDurationInput(true);
                this.updatePredictionInput();
            }
        }
    },
    createPredictionInput(prediction_range) {
        Blockly.Events.disable();

        if (prediction_range.length === 0) {
            this.removeInput('PREDICTION_LABEL', true);
            this.removeInput('PREDICTION', true);
        } else if (!this.getInput('PREDICTION')) {
            this.appendDummyInput('PREDICTION_LABEL')
                .appendField(translate('Prediction:'));

            const prediction_input = this.appendValueInput('PREDICTION');
            const shadow_block = this.workspace.newBlock('math_number');

            shadow_block.setShadow(true);
            shadow_block.setFieldValue(prediction_range[0], 'NUM');
            shadow_block.outputConnection.connect(prediction_input.connection);
            shadow_block.initSvg();
            shadow_block.render(true);
        }

        Blockly.Events.enable();
    },
    createBarrierInputs(barriers) {
        Blockly.Events.disable();

        const input_names  = ['BARRIER', 'SECONDBARRIER'];

        for (let i = 0; i < barriers.values.length; i++) {
            const label = (barriers.values.length === 1 ? translate('Barrier') : config.BARRIER_LABELS[i]);
            let input   = this.getInput(input_names[i]);

            if (input) {
                input.fieldRow[0].setText(label);
            } else {
                input = this.appendValueInput(input_names[i])
                    .appendField(label, `${input_names[i]}_LABEL`)
                    .appendField(new Blockly.FieldDropdown(config.BARRIER_TYPES), `${input_names[i]}TYPE_LIST`);

                const shadow_block = this.workspace.newBlock('math_number');

                shadow_block.setShadow(true);
                shadow_block.setFieldValue(barriers.values[i], 'NUM');
                shadow_block.outputConnection.connect(input.connection);
                shadow_block.initSvg();
                shadow_block.render(true);
            }
        }

        // Remove any extra inputs (quietly) if not required
        for (let i = input_names.length; i > barriers.values.length; i--) {
            this.removeInput(input_names[i - 1], true);
        }

        Blockly.Events.enable();
    },
    updateDurationInput(should_use_default_unit) {
        const { contracts_for } = ApiHelpers.instance;

        contracts_for.getDurations(this.selected_symbol, this.selected_trade_type).then(durations => {
            const duration_field_dropdown = this.getField('DURATIONTYPE_LIST');
            const duration_input          = this.getInput('DURATION');
            const { connection }          = duration_input;
            const duration_options        = durations.map(duration => [duration.display, duration.unit]);

            if (should_use_default_unit) {
                duration_field_dropdown.updateOptions(duration_options);
            } else {
                duration_field_dropdown.updateOptions(duration_options, this.selected_duration, false);
            }
            
            if (connection) {
                const target_block = connection.targetBlock();

                if (target_block && target_block.isShadow()) {
                    const min_duration = durations.find(d => d.unit === this.selected_duration);

                    if (min_duration) {
                        target_block.setFieldValue(min_duration.min, 'NUM');
                    }
                }
            }
        });
    },
    updateBarrierInputs(should_use_default_types) {
        const { contracts_for } = ApiHelpers.instance;
        const { BARRIER_TYPES } = config;

        contracts_for.getBarriers(
            this.selected_symbol,
            this.selected_trade_type,
            this.selected_duration,
            this.selected_barrier_types
        ).then(barriers => {
            this.createBarrierInputs(barriers);
            
            const input_names = ['BARRIER', 'SECONDBARRIER'];

            for (let i = 0; i < barriers.values.length; i++) {
                const barrier_field_dropdown = this.getField(`${input_names[i]}TYPE_LIST`);
                const { ABSOLUTE_BARRIER_DROPDOWN_OPTION } = config;
                const barrier_field_value =  should_use_default_types ?
                    BARRIER_TYPES[i][1] :
                    barrier_field_dropdown.getValue();
                
                if (this.selected_duration === 'd') {
                    // Only absolute types are allowed.
                    barrier_field_dropdown.updateOptions(ABSOLUTE_BARRIER_DROPDOWN_OPTION, 'absolute');
                } else if (barriers.allow_both_types || barriers.allow_absolute_type) {
                    // Both offset + absolute types are allowed.
                    const options = [].concat(BARRIER_TYPES, ABSOLUTE_BARRIER_DROPDOWN_OPTION);
                    barrier_field_dropdown.updateOptions(options, barrier_field_value);
                } else {
                    // Only offset types are allowed.
                    barrier_field_dropdown.updateOptions(BARRIER_TYPES, barrier_field_value);
                }

                const { connection } = this.getInput(input_names[i]);

                if (connection) {
                    const target_block = connection.targetBlock();
                    if (target_block.isShadow()) {
                        const barrier_value = barriers.values[i] !== false ? barriers.values[i] : '';
                        target_block.setFieldValue(barrier_value, 'NUM');
                    }
                }
            }
        });
    },
    updatePredictionInput() {
        const { contracts_for } = ApiHelpers.instance;

        contracts_for.getPredictionRange(this.selected_symbol, this.selected_trade_type).then(prediction_range => {
            this.createPredictionInput(prediction_range);

            if (prediction_range.length > 0) {
                const prediction_input = this.getInput('PREDICTION');
                const { connection } = prediction_input;

                if (connection) {
                    const target_block = connection.targetBlock();

                    if (target_block) {
                        const initial_prediction = Math.max(1, prediction_range[0]);
                        target_block.setFieldValue(initial_prediction, 'NUM');
                    }
                }
            }
        });
    },
    enforceSingleBarrierType(barrier_input_name, should_force_distinct = false) {
        const new_value                = this.getFieldValue(barrier_input_name);
        const other_barrier_input_name = barrier_input_name === 'BARRIERTYPE_LIST' ? 'SECONDBARRIERTYPE_LIST' : 'BARRIERTYPE_LIST';
        const other_barrier_field      = this.getField(other_barrier_input_name);
        const { BARRIER_TYPES }        = config;

        if (other_barrier_field) {
            const has_other_barrier  = BARRIER_TYPES.findIndex(type => type[1] === new_value) !== -1;
            const other_barrier_type = other_barrier_field.getValue();

            if (has_other_barrier && (other_barrier_type === 'absolute' || should_force_distinct)) {
                const other_barrier_value = BARRIER_TYPES.find(type => type[1] !== new_value);
                other_barrier_field.setValue(other_barrier_value[1]);
            } else if (new_value === 'absolute' && other_barrier_type !== 'absolute') {
                other_barrier_field.setValue('absolute');
            }
        }
    },
    domToMutation(xmlElement) {
        const has_first_barrier  = xmlElement.getAttribute('has_first_barrier') === 'true';
        const has_second_barrier = xmlElement.getAttribute('has_second_barrier') === 'true';
        const has_prediction     = xmlElement.getAttribute('has_prediction') === 'true';

        if (has_first_barrier && has_second_barrier) {
            this.createBarrierInputs({ values: [1, -1] }); // These values are overwritten with XML values.
        } else if (has_first_barrier) {
            this.createBarrierInputs({ values: [1] });
        } else if (has_prediction) {
            this.createPredictionInput([1]);
        }
    },
    mutationToDom() {
        const container = document.createElement('mutation');

        container.setAttribute('has_first_barrier', !!this.getInput('BARRIER'));
        container.setAttribute('has_second_barrier', !!this.getInput('SECONDBARRIER'));
        container.setAttribute('has_prediction', !!this.getInput('PREDICTION'));
        
        return container;
    },
};

Blockly.JavaScript.trade_definition_tradeoptions = block => {
    const amount           = Blockly.JavaScript.valueToCode(block, 'AMOUNT') || '0';
    const currency         = block.getFieldValue('CURRENCY_LIST');
    const duration_type    = block.getFieldValue('DURATIONTYPE_LIST') || '0';
    const duration_value   = Blockly.JavaScript.valueToCode(block, 'DURATION') || '0';

    const getBarrierValue = (barrier_offset_type, value) => {
        // Variables should not be encapsulated in quotes
        if (/^(\d+(\.\d+)?)$/.test(value)) {
            return barrier_offset_type === 'absolute' ? `'${value}'` : `'${barrier_offset_type}${value}'`;
        }
        return barrier_offset_type === 'absolute' ? value : `'${barrier_offset_type}' + ${value}`;
    };

    let prediction_value, barrier_offset_value, second_barrier_offset_value;

    if (block.getInput('PREDICTION')) {
        prediction_value = Blockly.JavaScript.valueToCode(block, 'PREDICTION') || '-1';
    }

    if (block.getInput('BARRIER')) {
        const barrier_offset_type = block.getFieldValue('BARRIERTYPE_LIST');
        const value               = Blockly.JavaScript.valueToCode(block, 'BARRIER') || '0';
        barrier_offset_value      = getBarrierValue(barrier_offset_type, value);
    }

    if (block.getInput('SECONDBARRIER')) {
        const barrier_offset_type   = block.getFieldValue('SECONDBARRIERTYPE_LIST');
        const value                 = Blockly.JavaScript.valueToCode(block, 'SECONDBARRIER') || '0';
        second_barrier_offset_value = getBarrierValue(barrier_offset_type, value);
    }

    const code = `
        Bot.start({
        limitations        : BinaryBotPrivateLimitations,
        duration           : ${duration_value || '0'},
        duration_unit      : '${duration_type || '0'}',
        currency           : '${currency}',
        amount             : ${amount || '0'},
        prediction         : ${prediction_value || 'undefined'},
        barrierOffset      : ${barrier_offset_value || 'undefined'},
        secondBarrierOffset: ${second_barrier_offset_value || 'undefined'},
        });
    `;
    return code;
};
