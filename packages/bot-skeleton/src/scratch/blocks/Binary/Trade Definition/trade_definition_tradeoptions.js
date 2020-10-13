import { localize } from '@deriv/translations';
import { getCurrencyDisplayCode, getDecimalPlaces } from '@deriv/shared';
import DBotStore from '../../../dbot-store';
import { runIrreversibleEvents } from '../../../utils';
import { config } from '../../../../constants/config';
import ApiHelpers from '../../../../services/api/api-helpers';

Blockly.Blocks.trade_definition_tradeoptions = {
    durations: [],
    init() {
        this.jsonInit(this.definition());

        // Ensure one of this type per statement-stack
        this.setNextStatement(false);
    },
    definition() {
        const is_stake = this.type === 'trade_definition_tradeoptions';

        return {
            message0: localize('Duration: {{ duration_unit }} {{ duration_value }}', {
                duration_unit: '%1',
                duration_value: '%2',
            }),
            message1: `${is_stake ? localize('Stake') : localize('Payout')}: %1 %2`,
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'DURATIONTYPE_LIST',
                    options: [['', '']],
                },
                {
                    type: 'input_value',
                    name: 'DURATION',
                },
            ],
            args1: [
                {
                    type: 'field_label',
                    name: 'CURRENCY_LIST',
                    text: getCurrencyDisplayCode(config.lists.CURRENCY[0]),
                },
                {
                    type: 'input_value',
                    name: 'AMOUNT',
                    check: 'Number',
                },
            ],
            colour: Blockly.Colours.Special1.colour,
            colourSecondary: Blockly.Colours.Special1.colourSecondary,
            colourTertiary: Blockly.Colours.Special1.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Define your trade options such as duration and stake.'),
            category: Blockly.Categories.Trade_Definition,
        };
    },
    meta() {
        return {
            display_name: localize('Trade options'),
            description: localize(
                'Define your trade options such as duration and stake. Some options are only applicable for certain trade types.'
            ),
        };
    },
    onchange(event) {
        if (!this.workspace || this.workspace.isDragging() || this.isInFlyout) {
            return;
        }

        if (
            (event.type === Blockly.Events.BLOCK_CREATE && event.ids.includes(this.id)) ||
            event.type === Blockly.Events.END_DRAG
        ) {
            this.setCurrency();
        }

        const trade_definition_block = this.workspace
            .getAllBlocks(true)
            .find(block => block.type === 'trade_definition');
        if (!trade_definition_block) {
            return;
        }

        const market_block = trade_definition_block.getChildByType('trade_definition_market');
        const trade_type_block = trade_definition_block.getChildByType('trade_definition_tradetype');

        if (!market_block || !trade_type_block) {
            return;
        }

        this.selected_symbol = market_block.getFieldValue('SYMBOL_LIST');
        this.selected_trade_type_category = trade_type_block.getFieldValue('TRADETYPECAT_LIST');
        this.selected_trade_type = trade_type_block.getFieldValue('TRADETYPE_LIST');
        this.selected_duration = this.getFieldValue('DURATIONTYPE_LIST');
        this.selected_barrier_types = [
            this.getFieldValue('BARRIEROFFSETTYPE_LIST') || config.BARRIER_TYPES[0][1],
            this.getFieldValue('SECONDBARRIEROFFSETTYPE_LIST') || config.BARRIER_TYPES[1][1],
        ];

        const is_load_event = /^dbot-load/.test(event.group);

        if (event.type === Blockly.Events.BLOCK_CREATE && event.ids.includes(this.id)) {
            if (is_load_event) {
                // Do NOT touch any values when a strategy is being loaded.
                this.updateBarrierInputs(false, false);
                this.updateDurationInput(false, false);
                this.updatePredictionInput(false);
            } else {
                this.updateBarrierInputs(true, true);
                this.enforceSingleBarrierType('BARRIEROFFSETTYPE_LIST', true);
                this.updateDurationInput(true, true);
                this.updatePredictionInput(true);
            }
        } else if (event.type === Blockly.Events.BLOCK_CHANGE) {
            if (is_load_event) {
                if (event.name === 'TRADETYPE_LIST') {
                    this.updateBarrierInputs(false, false);
                    this.enforceSingleBarrierType(false);
                    this.updateDurationInput(false, false);
                    this.updatePredictionInput(false);
                }
            } else if (event.blockId === this.id) {
                switch (event.name) {
                    case 'DURATIONTYPE_LIST': {
                        this.updateBarrierInputs(true, true);
                        this.enforceSingleBarrierType('BARRIEROFFSETTYPE_LIST', true);
                        this.updateDurationInput(false, true);
                        break;
                    }
                    case 'BARRIEROFFSETTYPE_LIST':
                    case 'SECONDBARRIEROFFSETTYPE_LIST': {
                        this.updateBarrierInputs(false, true);
                        this.enforceSingleBarrierType(event.name, false);
                        break;
                    }
                    default:
                        break;
                }
            } else if (event.name === 'SYMBOL_LIST' || event.name === 'TRADETYPE_LIST') {
                this.updateBarrierInputs(true, true);
                this.enforceSingleBarrierType(true);
                this.updateDurationInput(true, true);
                this.updatePredictionInput(true);
            }
        } else if (event.type === Blockly.Events.END_DRAG && event.blockId === this.id) {
            // Ensure this block is populated after initial drag from flyout.
            if (!this.selected_duration) {
                const fake_creation_event = new Blockly.Events.Create(this);
                fake_creation_event.recordUndo = false;
                Blockly.Events.fire(fake_creation_event);
            }
        }
    },
    createPredictionInput(prediction_range) {
        runIrreversibleEvents(() => {
            if (prediction_range.length === 0) {
                this.removeInput('PREDICTION_LABEL', true);
                this.removeInput('PREDICTION', true);
            } else if (!this.getInput('PREDICTION')) {
                this.appendDummyInput('PREDICTION_LABEL').appendField(localize('Prediction:'));

                const prediction_input = this.appendValueInput('PREDICTION');
                const shadow_block = this.workspace.newBlock('math_number_positive');

                shadow_block.setShadow(true);
                shadow_block.setFieldValue(prediction_range[0], 'NUM');
                shadow_block.outputConnection.connect(prediction_input.connection);
                shadow_block.initSvg();
                shadow_block.render(true);
            }
        });
    },
    createBarrierInputs(barriers) {
        runIrreversibleEvents(() => {
            const input_names = ['BARRIEROFFSET', 'SECONDBARRIEROFFSET'];

            for (let i = 0; i < barriers.values.length; i++) {
                const label = barriers.values.length === 1 ? localize('Barrier') : config.BARRIER_LABELS[i];
                let input = this.getInput(input_names[i]);

                if (input) {
                    input.fieldRow[0].setText(label);
                } else {
                    input = this.appendValueInput(input_names[i])
                        .appendField(label, `${input_names[i]}_LABEL`)
                        .appendField(new Blockly.FieldDropdown(config.BARRIER_TYPES), `${input_names[i]}TYPE_LIST`);

                    const shadow_block = this.workspace.newBlock('math_number_positive');

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
        });
    },
    updateDurationInput(should_use_default_unit, should_update_value) {
        const { contracts_for } = ApiHelpers.instance;

        contracts_for.getDurations(this.selected_symbol, this.selected_trade_type).then(durations => {
            // Keep duration in memory so we can later reference them for validation
            this.durations = durations;

            const duration_field_dropdown = this.getField('DURATIONTYPE_LIST');
            const duration_input = this.getInput('DURATION');
            const duration_options = durations.map(duration => [duration.display, duration.unit]);

            if (duration_field_dropdown) {
                duration_field_dropdown.updateOptions(duration_options, {
                    default_value: should_use_default_unit ? undefined : duration_field_dropdown.getValue(),
                });
            }

            if (should_update_value && duration_input && duration_input.connection) {
                const target_block = duration_input.connection.targetBlock();

                if (target_block && target_block.isShadow()) {
                    const min_duration = durations.find(d => d.unit === this.selected_duration);

                    if (min_duration) {
                        runIrreversibleEvents(() => {
                            target_block.setFieldValue(min_duration.min, 'NUM');
                        });
                    }
                }
            }
        });
    },
    updateBarrierInputs(should_use_default_type, should_use_default_values) {
        const { contracts_for } = ApiHelpers.instance;
        const { BARRIER_TYPES } = config;

        contracts_for
            .getBarriers(
                this.selected_symbol,
                this.selected_trade_type,
                this.selected_duration,
                this.selected_barrier_types
            )
            .then(barriers => {
                this.createBarrierInputs(barriers);

                const input_names = ['BARRIEROFFSET', 'SECONDBARRIEROFFSET'];

                for (let i = 0; i < barriers.values.length; i++) {
                    const barrier_field_dropdown = this.getField(`${input_names[i]}TYPE_LIST`);
                    const { ABSOLUTE_BARRIER_DROPDOWN_OPTION } = config;
                    const barrier_field_value = should_use_default_type
                        ? BARRIER_TYPES[i][1]
                        : barrier_field_dropdown.getValue();

                    if (this.selected_duration === 'd') {
                        // Only absolute types are allowed.
                        barrier_field_dropdown.updateOptions(ABSOLUTE_BARRIER_DROPDOWN_OPTION, {
                            default_value: 'absolute',
                        });
                    } else if (barriers.allow_both_types || barriers.allow_absolute_type) {
                        // Both offset + absolute types are allowed.
                        const options = [].concat(BARRIER_TYPES, ABSOLUTE_BARRIER_DROPDOWN_OPTION);

                        barrier_field_dropdown.updateOptions(options, {
                            default_value: barrier_field_value,
                        });
                    } else {
                        // Only offset types are allowed.
                        barrier_field_dropdown.updateOptions(BARRIER_TYPES, {
                            default_value: barrier_field_value,
                        });
                    }

                    const { connection } = this.getInput(input_names[i]);

                    if (should_use_default_values && connection) {
                        const target_block = connection.targetBlock();

                        if (target_block && target_block.isShadow()) {
                            const barrier_value = barriers.values[i] !== false ? barriers.values[i] : '';

                            runIrreversibleEvents(() => {
                                target_block.setFieldValue(barrier_value, 'NUM');
                            });
                        }
                    }
                }
            });
    },
    updatePredictionInput(should_use_default_value) {
        const { contracts_for } = ApiHelpers.instance;

        contracts_for.getPredictionRange(this.selected_symbol, this.selected_trade_type).then(prediction_range => {
            this.createPredictionInput(prediction_range);

            if (prediction_range.length > 0) {
                const prediction_input = this.getInput('PREDICTION');
                const { connection } = prediction_input;

                if (should_use_default_value && connection) {
                    const target_block = connection.targetBlock();

                    if (target_block && target_block.isShadow()) {
                        const initial_prediction = Math.max(1, prediction_range[0]);

                        runIrreversibleEvents(() => {
                            target_block.setFieldValue(initial_prediction, 'NUM');
                        });
                    }
                }
            }
        });
    },
    enforceSingleBarrierType(barrier_input_name, should_force_distinct) {
        const new_value = this.getFieldValue(barrier_input_name);
        const other_barrier_input_name =
            barrier_input_name === 'BARRIEROFFSETTYPE_LIST' ? 'SECONDBARRIEROFFSETTYPE_LIST' : 'BARRIEROFFSETTYPE_LIST';
        const other_barrier_field = this.getField(other_barrier_input_name);
        const { BARRIER_TYPES } = config;

        if (other_barrier_field) {
            const has_other_barrier = BARRIER_TYPES.findIndex(type => type[1] === new_value) !== -1;
            const other_barrier_type = other_barrier_field.getValue();

            runIrreversibleEvents(() => {
                if (has_other_barrier && (other_barrier_type === 'absolute' || should_force_distinct)) {
                    const other_barrier_value = BARRIER_TYPES.find(type => type[1] !== new_value);
                    other_barrier_field.setValue(other_barrier_value[1]);
                } else if (new_value === 'absolute' && other_barrier_type !== 'absolute') {
                    other_barrier_field.setValue('absolute');
                }
            });
        }
    },
    domToMutation(xmlElement) {
        const has_first_barrier = xmlElement.getAttribute('has_first_barrier') === 'true';
        const has_second_barrier = xmlElement.getAttribute('has_second_barrier') === 'true';
        const has_prediction = xmlElement.getAttribute('has_prediction') === 'true';

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

        container.setAttribute('has_first_barrier', !!this.getInput('BARRIEROFFSET'));
        container.setAttribute('has_second_barrier', !!this.getInput('SECONDBARRIEROFFSET'));
        container.setAttribute('has_prediction', !!this.getInput('PREDICTION'));

        return container;
    },
    setCurrency() {
        const currency_field = this.getField('CURRENCY_LIST');
        const { currency } = DBotStore.instance.client;
        currency_field.setText(getCurrencyDisplayCode(currency));
    },
    restricted_parents: ['trade_definition'],
    getRequiredValueInputs() {
        return {
            AMOUNT: input => {
                const input_number = Number(input);
                this.error_message = localize('Amount must be a positive number.');
                return !isNaN(input_number) && input_number <= 0;
            },
            DURATION: input => {
                const input_number = Number(input);

                if (isNaN(input_number) || !this.durations.length) {
                    return false;
                }

                const duration = this.durations.find(d => d.unit === this.selected_duration);

                if (duration) {
                    const { min, max } = duration;
                    const is_valid_duration = input_number >= min && input_number <= max;

                    if (min === max) {
                        this.error_message = localize(
                            'Duration value is not allowed. To run the bot, please enter {{min}}.',
                            { min }
                        );
                    } else {
                        this.error_message = localize(
                            'Duration value is not allowed. To run the bot, please enter a value between {{min}} to {{max}}.',
                            { min, max }
                        );
                    }

                    return !is_valid_duration;
                }

                return false;
            },
        };
    },
};

Blockly.Blocks.trade_definition_tradeoptions_payout = Blockly.Blocks.trade_definition_tradeoptions;

Blockly.JavaScript.trade_definition_tradeoptions = block => {
    const amount = Blockly.JavaScript.valueToCode(block, 'AMOUNT', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const { currency } = DBotStore.instance.client;
    const duration_type = block.getFieldValue('DURATIONTYPE_LIST') || '0';
    const duration_value = Blockly.JavaScript.valueToCode(block, 'DURATION', Blockly.JavaScript.ORDER_ATOMIC) || '0';

    // Determine decimal places for rounding the stake, this is done so Martingale multipliers
    // are not affected by fractional values e.g. USD 12.232323 will become 12.23.
    const decimal_places = getDecimalPlaces(currency);
    const stake_amount = `+(Number(${amount}).toFixed(${decimal_places}))`;

    const getBarrierValue = (barrier_offset_type, value) => {
        // Variables should not be encapsulated in quotes
        if (/^(\d+(\.\d+)?)$/.test(value)) {
            return barrier_offset_type === 'absolute' ? `'${value}'` : `'${barrier_offset_type}${value}'`;
        }
        return barrier_offset_type === 'absolute' ? value : `'${barrier_offset_type}' + ${value}`;
    };

    let prediction_value, barrier_offset_value, second_barrier_offset_value;

    if (block.getInput('PREDICTION')) {
        prediction_value = Blockly.JavaScript.valueToCode(block, 'PREDICTION', Blockly.JavaScript.ORDER_ATOMIC) || '-1';
    }

    if (block.getInput('BARRIEROFFSET')) {
        const barrier_offset_type = block.getFieldValue('BARRIEROFFSETTYPE_LIST');
        const value = Blockly.JavaScript.valueToCode(block, 'BARRIEROFFSET', Blockly.JavaScript.ORDER_ATOMIC) || '0';
        barrier_offset_value = getBarrierValue(barrier_offset_type, value);
    }

    if (block.getInput('SECONDBARRIEROFFSET')) {
        const barrier_offset_type = block.getFieldValue('SECONDBARRIEROFFSETTYPE_LIST');
        const value =
            Blockly.JavaScript.valueToCode(block, 'SECONDBARRIEROFFSET', Blockly.JavaScript.ORDER_ATOMIC) || '0';
        second_barrier_offset_value = getBarrierValue(barrier_offset_type, value);
    }

    const code = `
        Bot.start({
            limitations        : BinaryBotPrivateLimitations,
            duration           : ${duration_value},
            duration_unit      : '${duration_type}',
            currency           : '${currency}',
            amount             : ${stake_amount},
            prediction         : ${prediction_value || 'undefined'},
            barrierOffset      : ${barrier_offset_value || 'undefined'},
            secondBarrierOffset: ${second_barrier_offset_value || 'undefined'},
            basis              : '${block.type === 'trade_definition_tradeoptions' ? 'stake' : 'payout'}',
        });
        BinaryBotPrivateHasCalledTradeOptions = true;
    `;

    return code;
};

Blockly.JavaScript.trade_definition_tradeoptions_payout = Blockly.JavaScript.trade_definition_tradeoptions;
