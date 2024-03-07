import { help_content_types, help_content_config } from '../help-content.config';

describe('help_content_config', () => {
    const { TEXT, IMAGE, BLOCK, EXAMPLE } = help_content_types;
    const publicPath = '/my-public-path';
    const config = help_content_config(publicPath);

    it('should set webpack_public_path and return configuration object', () => {
        expect(window.__webpack_public_path__).toBe(publicPath);
    });

    describe('procedures_ifreturn', () => {
        it('should have 4 items', () => {
            expect(config.procedures_ifreturn).toHaveLength(4);
        });

        it('should have the correct types and example_id', () => {
            expect(config.procedures_ifreturn[0]).toEqual({ type: TEXT });
            expect(config.procedures_ifreturn[1]).toEqual({ type: BLOCK });
            expect(config.procedures_ifreturn[2]).toEqual({ type: TEXT });
            expect(config.procedures_ifreturn[3]).toEqual({ type: EXAMPLE, example_id: 'if-return' });
        });
    });

    describe('math_arithmetic', () => {
        it('should have 8 items', () => {
            expect(config.math_arithmetic).toHaveLength(8);
        });

        it('should have the correct types', () => {
            expect(config.math_arithmetic[0]).toEqual({ type: TEXT });
            expect(config.math_arithmetic[1]).toEqual({ type: BLOCK });
            expect(config.math_arithmetic[2]).toEqual({ type: TEXT });
            expect(config.math_arithmetic[3]).toEqual({ type: TEXT });
            expect(config.math_arithmetic[4]).toEqual({ type: TEXT });
            expect(config.math_arithmetic[5]).toEqual({ type: TEXT });
            expect(config.math_arithmetic[6]).toEqual({ type: TEXT });
            expect(config.math_arithmetic[7]).toEqual({ type: TEXT });
        });
    });

    describe('math_single', () => {
        it('should have 9 items', () => {
            expect(config.math_single).toHaveLength(9);
        });

        it('should have the correct types', () => {
            expect(config.math_single[0]).toEqual({ type: TEXT });
            expect(config.math_single[1]).toEqual({ type: BLOCK });
            expect(config.math_single[2]).toEqual({ type: TEXT });
            expect(config.math_single[3]).toEqual({ type: TEXT });
            expect(config.math_single[4]).toEqual({ type: TEXT });
            expect(config.math_single[5]).toEqual({ type: TEXT });
            expect(config.math_single[6]).toEqual({ type: TEXT });
            expect(config.math_single[7]).toEqual({ type: TEXT });
            expect(config.math_single[8]).toEqual({ type: TEXT });
        });
    });

    describe('math_constrain', () => {
        it('should have 5 items', () => {
            expect(config.math_constrain).toHaveLength(5);
        });

        it('should have the correct types and example_id', () => {
            expect(config.math_constrain[0]).toEqual({ type: TEXT });
            expect(config.math_constrain[1]).toEqual({ type: BLOCK });
            expect(config.math_constrain[2]).toEqual({ type: TEXT });
            expect(config.math_constrain[3]).toEqual({ type: TEXT });
            expect(config.math_constrain[4]).toEqual({ type: EXAMPLE, example_id: 'constrain' });
        });
    });

    describe('text_print', () => {
        it('should have 3 items', () => {
            expect(config.text_print).toHaveLength(3);
        });

        it('should have the correct types', () => {
            expect(config.text_print[0]).toEqual({ type: TEXT });
            expect(config.text_print[1]).toEqual({ type: BLOCK });
            expect(config.text_print[2]).toEqual({ type: TEXT });
        });
    });

    describe('text_prompt_ext', () => {
        it('should have 3 items', () => {
            expect(config.text_prompt_ext).toHaveLength(3);
        });

        it('should have the correct types', () => {
            expect(config.text_prompt_ext[0]).toEqual({ type: TEXT });
            expect(config.text_prompt_ext[1]).toEqual({ type: BLOCK });
            expect(config.text_prompt_ext[2]).toEqual({ type: TEXT });
        });
    });

    describe('tick_analysis', () => {
        it('should have 2 items', () => {
            expect(config.tick_analysis).toHaveLength(2);
        });

        it('should have the correct types', () => {
            expect(config.tick_analysis[0]).toEqual({ type: TEXT });
            expect(config.tick_analysis[1]).toEqual({ type: BLOCK });
        });
    });

    describe('read_details', () => {
        it('should have 14 items', () => {
            expect(config.read_details).toHaveLength(14);
        });

        it('should have the correct types', () => {
            expect(config.read_details[0]).toEqual({ type: TEXT });
            expect(config.read_details[1]).toEqual({ type: BLOCK });
            expect(config.read_details[2]).toEqual({ type: TEXT });
            expect(config.read_details[3]).toEqual({ type: TEXT });
            expect(config.read_details[4]).toEqual({ type: TEXT });
            expect(config.read_details[5]).toEqual({ type: TEXT });
            expect(config.read_details[6]).toEqual({ type: TEXT });
            expect(config.read_details[7]).toEqual({ type: TEXT });
            expect(config.read_details[8]).toEqual({ type: TEXT });
            expect(config.read_details[9]).toEqual({ type: TEXT });
            expect(config.read_details[10]).toEqual({ type: TEXT });
            expect(config.read_details[11]).toEqual({ type: TEXT });
            expect(config.read_details[12]).toEqual({ type: TEXT });
            expect(config.read_details[13]).toEqual({ type: TEXT });
        });
    });

    describe('last_digit', () => {
        it('should have 2 items', () => {
            expect(config.last_digit).toHaveLength(2);
        });

        it('should have the correct types', () => {
            expect(config.last_digit[0]).toEqual({ type: TEXT });
            expect(config.last_digit[1]).toEqual({ type: BLOCK });
        });
    });

    describe('read_ohlc', () => {
        it('should have 9 items', () => {
            expect(config.read_ohlc).toHaveLength(9);
        });

        it('should have the correct types and example_id', () => {
            expect(config.read_ohlc[0]).toEqual({ type: TEXT });
            expect(config.read_ohlc[1]).toEqual({ type: BLOCK });
            expect(config.read_ohlc[2]).toEqual({ type: TEXT });
            expect(config.read_ohlc[3]).toEqual({ type: TEXT });
            expect(config.read_ohlc[4]).toEqual({ type: TEXT });
            expect(config.read_ohlc[5]).toEqual({ type: TEXT });
            expect(config.read_ohlc[6]).toEqual({ type: TEXT });
            expect(config.read_ohlc[7]).toEqual({ type: TEXT });
            expect(config.read_ohlc[8]).toEqual({ type: EXAMPLE, example_id: 'in_candle_list_read' });
        });
    });

    describe('read_ohlc_obj', () => {
        it('should have 4 items', () => {
            expect(config.read_ohlc_obj).toHaveLength(5);
        });

        it('should have the correct types and example_id', () => {
            expect(config.read_ohlc_obj[0]).toEqual({ type: TEXT });
            expect(config.read_ohlc_obj[1]).toEqual({ type: BLOCK });
            expect(config.read_ohlc_obj[2]).toEqual({ type: TEXT });
            expect(config.read_ohlc_obj[3]).toEqual({ type: TEXT });
            expect(config.read_ohlc_obj[4]).toEqual({ type: EXAMPLE, example_id: 'read_candle_value' });
        });
    });

    describe('check_direction', () => {
        it('should have 5 items', () => {
            expect(config.check_direction).toHaveLength(5);
        });

        it('should have the correct types', () => {
            expect(config.check_direction[0]).toEqual({ type: TEXT });
            expect(config.check_direction[1]).toEqual({ type: BLOCK });
            expect(config.check_direction[2]).toEqual({ type: TEXT });
            expect(config.check_direction[3]).toEqual({ type: TEXT });
            expect(config.check_direction[4]).toEqual({ type: TEXT });
        });
    });

    describe('get_ohlc', () => {
        it('should have 5 items', () => {
            expect(config.get_ohlc).toHaveLength(5);
        });

        it('should have the correct types and example_id', () => {
            expect(config.get_ohlc[0]).toEqual({ type: TEXT });
            expect(config.get_ohlc[1]).toEqual({ type: BLOCK });
            expect(config.get_ohlc[2]).toEqual({ type: TEXT });
            expect(config.get_ohlc[3]).toEqual({ type: EXAMPLE, example_id: 'get_candle' });
            expect(config.get_ohlc[4]).toEqual({ type: TEXT });
        });
    });

    describe('ohlc', () => {
        it('should have 4 items', () => {
            expect(config.ohlc).toHaveLength(4);
        });

        it('should have the correct types and example_id', () => {
            expect(config.ohlc[0]).toEqual({ type: TEXT });
            expect(config.ohlc[1]).toEqual({ type: BLOCK });
            expect(config.ohlc[2]).toEqual({ type: TEXT });
            expect(config.ohlc[3]).toEqual({ type: EXAMPLE, example_id: 'candle_list_1' });
        });
    });

    describe('ohlc_values', () => {
        it('should have 4 items', () => {
            expect(config.ohlc_values).toHaveLength(4);
        });

        it('should have the correct types and example_id', () => {
            expect(config.ohlc_values[0]).toEqual({ type: TEXT });
            expect(config.ohlc_values[1]).toEqual({ type: BLOCK });
            expect(config.ohlc_values[2]).toEqual({ type: TEXT });
            expect(config.ohlc_values[3]).toEqual({ type: EXAMPLE, example_id: 'candle_list' });
        });
    });

    describe('is_candle_black', () => {
        it('should have 13 items', () => {
            expect(config.is_candle_black).toHaveLength(13);
        });

        it('should have the correct types and example_id', () => {
            expect(config.is_candle_black[0]).toEqual({ type: TEXT });
            expect(config.is_candle_black[1]).toEqual({ type: BLOCK });
            expect(config.is_candle_black[2]).toEqual({ type: TEXT });
            expect(config.is_candle_black[3]).toEqual({ type: TEXT });
            expect(config.is_candle_black[4]).toEqual({ type: TEXT });
            expect(config.is_candle_black[5]).toEqual({ type: TEXT });
            expect(config.is_candle_black[6]).toEqual({ type: TEXT });
            expect(config.is_candle_black[7]).toEqual({ type: TEXT });
            expect(config.is_candle_black[8]).toEqual({ type: TEXT });
            expect(config.is_candle_black[9]).toEqual({
                type: IMAGE,
                width: '100%',
                url: `${__webpack_public_path__}media/is_candle_black.jpeg`,
            });
            expect(config.is_candle_black[10]).toEqual({ type: TEXT });
            expect(config.is_candle_black[11]).toEqual({
                type: IMAGE,
                width: '100%',
                url: `${__webpack_public_path__}media/is_candle_black_1.jpeg`,
            });
            expect(config.is_candle_black[12]).toEqual({ type: TEXT });
        });
    });

    describe('ohlc_values_in_list', () => {
        it('should have 5 items', () => {
            expect(config.ohlc_values_in_list).toHaveLength(5);
        });

        it('should have the correct types and example_id', () => {
            expect(config.ohlc_values_in_list[0]).toEqual({ type: TEXT });
            expect(config.ohlc_values_in_list[1]).toEqual({ type: BLOCK });
            expect(config.ohlc_values_in_list[2]).toEqual({ type: TEXT });
            expect(config.ohlc_values_in_list[3]).toEqual({ type: TEXT });
            expect(config.ohlc_values_in_list[4]).toEqual({ type: EXAMPLE, example_id: 'candle_list_1' });
        });
    });

    describe('variables_gets', () => {
        it('should have 9 items', () => {
            expect(config.variables_gets).toHaveLength(9);
        });

        it('should have the correct types', () => {
            expect(config.variables_gets[0]).toEqual({ type: TEXT });
            expect(config.variables_gets[1]).toEqual({ type: BLOCK });
            expect(config.variables_gets[2]).toEqual({ type: TEXT });
            expect(config.variables_gets[3]).toEqual({ type: TEXT });
            expect(config.variables_gets[4]).toEqual({ type: TEXT });
            expect(config.variables_gets[5]).toEqual({ type: TEXT });
            expect(config.variables_gets[6]).toEqual({ type: TEXT });
            expect(config.variables_gets[7]).toEqual({ type: TEXT });
            expect(config.variables_gets[8]).toEqual({ type: TEXT });
        });
    });

    describe('variables_set', () => {
        it('should have 8 items', () => {
            expect(config.variables_set).toHaveLength(8);
        });

        it('should have the correct types and example_id', () => {
            expect(config.variables_set[0]).toEqual({ type: TEXT });
            expect(config.variables_set[1]).toEqual({ type: BLOCK });
            expect(config.variables_set[2]).toEqual({ type: TEXT });
            expect(config.variables_set[3]).toEqual({ type: TEXT });
            expect(config.variables_set[4]).toEqual({ type: TEXT });
            expect(config.variables_set[5]).toEqual({
                type: IMAGE,
                width: '100%',
                url: `${__webpack_public_path__}media/create_variable.jpg`,
            });
            expect(config.variables_set[6]).toEqual({ type: TEXT });
            expect(config.variables_set[7]).toEqual({
                type: IMAGE,
                width: '100%',
                url: `${__webpack_public_path__}media/set_variable.png`,
            });
        });
    });

    describe('epoch', () => {
        it('should have 8 items', () => {
            expect(config.epoch).toHaveLength(8);
        });

        it('should have the correct types and example_id', () => {
            expect(config.epoch[0]).toEqual({ type: TEXT });
            expect(config.epoch[1]).toEqual({ type: BLOCK });
            expect(config.epoch[2]).toEqual({ type: TEXT });
            expect(config.epoch[3]).toEqual({ type: TEXT });
            expect(config.epoch[4]).toEqual({ type: TEXT });
            expect(config.epoch[5]).toEqual({ type: TEXT });
            expect(config.epoch[6]).toEqual({ type: TEXT });
            expect(config.epoch[7]).toEqual({ type: EXAMPLE, example_id: 'epoch' });
        });
    });

    describe('todatetime', () => {
        it('should have 5 items', () => {
            expect(config.todatetime).toHaveLength(5);
        });

        it('should have the correct types and example_id', () => {
            expect(config.todatetime[0]).toEqual({ type: TEXT });
            expect(config.todatetime[1]).toEqual({ type: BLOCK });
            expect(config.todatetime[2]).toEqual({ type: TEXT });
            expect(config.todatetime[3]).toEqual({ type: EXAMPLE, example_id: 'todatetime' });
            expect(config.todatetime[4]).toEqual({ type: TEXT });
        });
    });

    describe('totimestamp', () => {
        it('should have 5 items', () => {
            expect(config.totimestamp).toHaveLength(5);
        });

        it('should have the correct types and example_id', () => {
            expect(config.totimestamp[0]).toEqual({ type: TEXT });
            expect(config.totimestamp[1]).toEqual({ type: BLOCK });
            expect(config.totimestamp[2]).toEqual({ type: TEXT });
            expect(config.totimestamp[3]).toEqual({ type: EXAMPLE, example_id: 'totimestamp' });
            expect(config.totimestamp[4]).toEqual({ type: TEXT });
        });
    });

    describe('notify_telegram', () => {
        it('should have 12 items', () => {
            expect(config.notify_telegram).toHaveLength(12);
        });

        it('should have the correct types and example_id', () => {
            expect(config.notify_telegram[0]).toEqual({ type: TEXT });
            expect(config.notify_telegram[1]).toEqual({ type: BLOCK });
            expect(config.notify_telegram[2]).toEqual({ type: TEXT });
            expect(config.notify_telegram[3]).toEqual({ type: TEXT });
            expect(config.notify_telegram[4]).toEqual({ type: TEXT });
            expect(config.notify_telegram[5]).toEqual({ type: TEXT });
            expect(config.notify_telegram[6]).toEqual({ type: TEXT });
            expect(config.notify_telegram[7]).toEqual({ type: TEXT });
            expect(config.notify_telegram[8]).toEqual({ type: TEXT });
            expect(config.notify_telegram[9]).toEqual({ type: TEXT });
            expect(config.notify_telegram[10]).toEqual({ type: TEXT });
            expect(config.notify_telegram[11]).toEqual({ type: EXAMPLE, example_id: 'notify_telegram' });
        });
    });

    describe('console', () => {
        it('should have 6 items', () => {
            expect(config.console).toHaveLength(6);
        });

        it('should have the correct types', () => {
            expect(config.console[0]).toEqual({ type: TEXT });
            expect(config.console[1]).toEqual({ type: TEXT });
            expect(config.console[2]).toEqual({ type: TEXT });
            expect(config.console[3]).toEqual({ type: TEXT });
            expect(config.console[4]).toEqual({ type: TEXT });
            expect(config.console[5]).toEqual({ type: TEXT });
        });
    });

    describe('balance', () => {
        it('should have 7 items', () => {
            expect(config.balance).toHaveLength(7);
        });

        it('should have the correct types', () => {
            expect(config.balance[0]).toEqual({ type: TEXT });
            expect(config.balance[1]).toEqual({ type: BLOCK });
            expect(config.balance[2]).toEqual({ type: TEXT });
            expect(config.balance[3]).toEqual({ type: TEXT });
            expect(config.balance[4]).toEqual({ type: TEXT });
            expect(config.balance[5]).toEqual({ type: TEXT });
            expect(config.balance[6]).toEqual({ type: TEXT });
        });
    });

    describe('sma_statement', () => {
        it('should have 27 items', () => {
            expect(config.sma_statement).toHaveLength(27);
        });

        it('should have the correct types and example_id', () => {
            expect(config.sma_statement[0]).toEqual({ type: TEXT });
            expect(config.sma_statement[1]).toEqual({ type: BLOCK });
            expect(config.sma_statement[2]).toEqual({ type: TEXT });
            expect(config.sma_statement[3]).toEqual({
                type: IMAGE,
                width: '60%',
                url: `${__webpack_public_path__}media/sma_formula.png`,
            });
            expect(config.sma_statement[4]).toEqual({ type: TEXT });
            expect(config.sma_statement[5]).toEqual({ type: TEXT });
            expect(config.sma_statement[6]).toEqual({ type: TEXT });
            expect(config.sma_statement[7]).toEqual({ type: TEXT });
            expect(config.sma_statement[8]).toEqual({
                type: IMAGE,
                width: '100%',
                url: `${__webpack_public_path__}media/sma_chart_1.png`,
            });
            expect(config.sma_statement[9]).toEqual({ type: TEXT });
            expect(config.sma_statement[10]).toEqual({
                type: IMAGE,
                width: '100%',
                url: `${__webpack_public_path__}media/sma_chart_2.png`,
            });
            expect(config.sma_statement[11]).toEqual({ type: TEXT });
            expect(config.sma_statement[12]).toEqual({ type: TEXT });
            expect(config.sma_statement[13]).toEqual({ type: TEXT });
            expect(config.sma_statement[14]).toEqual({ type: TEXT });
            expect(config.sma_statement[15]).toEqual({ type: TEXT });
            expect(config.sma_statement[16]).toEqual({ type: EXAMPLE, example_id: 'sma_block_example' });
            expect(config.sma_statement[17]).toEqual({ type: TEXT });
            expect(config.sma_statement[18]).toEqual({ type: TEXT });
            expect(config.sma_statement[19]).toEqual({ type: EXAMPLE, example_id: 'sma_block_example_1' });
            expect(config.sma_statement[20]).toEqual({ type: TEXT });
            expect(config.sma_statement[21]).toEqual({ type: TEXT });
            expect(config.sma_statement[22]).toEqual({ type: EXAMPLE, example_id: 'sma_array' });
            expect(config.sma_statement[23]).toEqual({ type: TEXT });
            expect(config.sma_statement[24]).toEqual({ type: TEXT });
            expect(config.sma_statement[25]).toEqual({ type: TEXT });
            expect(config.sma_statement[26]).toEqual({
                type: IMAGE,
                width: '100%',
                url: `${__webpack_public_path__}media/sma_array_explanation.jpeg`,
            });
        });
    });

    describe('trade_definition', () => {
        it('should have 18 items', () => {
            expect(config.trade_definition).toHaveLength(18);
        });

        it('should have the correct types', () => {
            expect(config.trade_definition[0]).toEqual({ type: TEXT });
            expect(config.trade_definition[1]).toEqual({ type: TEXT });
            expect(config.trade_definition[2]).toEqual({ type: TEXT });
            expect(config.trade_definition[3]).toEqual({ type: TEXT });
            expect(config.trade_definition[4]).toEqual({ type: TEXT });
            expect(config.trade_definition[5]).toEqual({ type: TEXT });
            expect(config.trade_definition[6]).toEqual({ type: TEXT });
            expect(config.trade_definition[7]).toEqual({ type: TEXT });
            expect(config.trade_definition[8]).toEqual({ type: TEXT });
            expect(config.trade_definition[9]).toEqual({ type: TEXT });
            expect(config.trade_definition[10]).toEqual({ type: TEXT });
            expect(config.trade_definition[11]).toEqual({ type: TEXT });
            expect(config.trade_definition[12]).toEqual({ type: TEXT });
            expect(config.trade_definition[13]).toEqual({ type: TEXT });
            expect(config.trade_definition[14]).toEqual({ type: TEXT });
            expect(config.trade_definition[15]).toEqual({ type: TEXT });
            expect(config.trade_definition[16]).toEqual({ type: TEXT });
            expect(config.trade_definition[17]).toEqual({ type: BLOCK });
        });
    });

    describe('trade_definition_tradeoptions', () => {
        it('should have 2 items', () => {
            expect(config.trade_definition_tradeoptions).toHaveLength(2);
        });

        it('should have the correct types', () => {
            expect(config.trade_definition_tradeoptions[0]).toEqual({ type: TEXT });
            expect(config.trade_definition_tradeoptions[1]).toEqual({ type: BLOCK });
        });
    });

    describe('trade_definition_multiplier', () => {
        it('should have 4 items', () => {
            expect(config.trade_definition_multiplier).toHaveLength(4);
        });

        it('should have the correct types', () => {
            expect(config.trade_definition_multiplier[0]).toEqual({ type: TEXT });
            expect(config.trade_definition_multiplier[1]).toEqual({ type: TEXT });
            expect(config.trade_definition_multiplier[2]).toEqual({ type: TEXT });
            expect(config.trade_definition_multiplier[3]).toEqual({ type: TEXT });
        });
    });

    describe('before_purchase', () => {
        it('should have 3 items', () => {
            expect(config.before_purchase).toHaveLength(3);
        });

        it('should have the correct types', () => {
            expect(config.before_purchase[0]).toEqual({ type: TEXT });
            expect(config.before_purchase[1]).toEqual({ type: BLOCK });
            expect(config.before_purchase[2]).toEqual({ type: TEXT });
        });
    });

    describe('during_purchase', () => {
        it('should have 4 items', () => {
            expect(config.during_purchase).toHaveLength(4);
        });

        it('should have the correct types and example_id', () => {
            expect(config.during_purchase[0]).toEqual({ type: TEXT });
            expect(config.during_purchase[1]).toEqual({ type: BLOCK });
            expect(config.during_purchase[2]).toEqual({ type: TEXT });
            expect(config.during_purchase[3]).toEqual({ type: EXAMPLE, example_id: 'sell_available' });
        });
    });

    describe('sell_at_market', () => {
        it('should have 4 items', () => {
            expect(config.sell_at_market).toHaveLength(4);
        });

        it('should have the correct types and example_id', () => {
            expect(config.sell_at_market[0]).toEqual({ type: TEXT });
            expect(config.sell_at_market[1]).toEqual({ type: BLOCK });
            expect(config.sell_at_market[2]).toEqual({ type: TEXT });
            expect(config.sell_at_market[3]).toEqual({ type: EXAMPLE, example_id: 'sell_available' });
        });
    });

    describe('after_purchase', () => {
        it('should have 3 items', () => {
            expect(config.after_purchase).toHaveLength(3);
        });

        it('should have the correct types', () => {
            expect(config.after_purchase[0]).toEqual({ type: TEXT });
            expect(config.after_purchase[1]).toEqual({ type: BLOCK });
            expect(config.after_purchase[2]).toEqual({ type: TEXT });
        });
    });

    describe('trade_again', () => {
        it('should have 4 items', () => {
            expect(config.trade_again).toHaveLength(4);
        });

        it('should have the correct types and example_id', () => {
            expect(config.trade_again[0]).toEqual({ type: TEXT });
            expect(config.trade_again[1]).toEqual({ type: BLOCK });
            expect(config.trade_again[2]).toEqual({ type: TEXT });
            expect(config.trade_again[3]).toEqual({ type: EXAMPLE, example_id: 'trade_again' });
        });
    });

    describe('contract_check_result', () => {
        it('should have 5 items', () => {
            expect(config.contract_check_result).toHaveLength(5);
        });

        it('should have the correct types and example_id', () => {
            expect(config.contract_check_result[0]).toEqual({ type: TEXT });
            expect(config.contract_check_result[1]).toEqual({ type: BLOCK });
            expect(config.contract_check_result[2]).toEqual({ type: TEXT });
            expect(config.contract_check_result[3]).toEqual({ type: TEXT });
            expect(config.contract_check_result[4]).toEqual({ type: EXAMPLE, example_id: 'check_result' });
        });
    });

    describe('sell_price', () => {
        it('should have 4 items', () => {
            expect(config.sell_price).toHaveLength(4);
        });

        it('should have the correct types and example_id', () => {
            expect(config.sell_price[0]).toEqual({ type: TEXT });
            expect(config.sell_price[1]).toEqual({ type: BLOCK });
            expect(config.sell_price[2]).toEqual({ type: TEXT });
            expect(config.sell_price[3]).toEqual({ type: EXAMPLE, example_id: 'sell_pl' });
        });
    });

    describe('controls_if', () => {
        it('should have 7 items', () => {
            expect(config.controls_if).toHaveLength(7);
        });

        it('should have the correct types and example_id', () => {
            expect(config.controls_if[0]).toEqual({ type: TEXT });
            expect(config.controls_if[1]).toEqual({ type: BLOCK });
            expect(config.controls_if[2]).toEqual({ type: TEXT });
            expect(config.controls_if[3]).toEqual({ type: EXAMPLE, example_id: 'controls_if' });
            expect(config.controls_if[4]).toEqual({ type: TEXT });
            expect(config.controls_if[5]).toEqual({ type: EXAMPLE, example_id: 'compare_logic' });
            expect(config.controls_if[6]).toEqual({ type: EXAMPLE, example_id: 'compare_logic_1' });
        });
    });

    describe('logic_operation', () => {
        it('should have 5 items', () => {
            expect(config.logic_operation).toHaveLength(5);
        });

        it('should have the correct types and url', () => {
            expect(config.logic_operation[0]).toEqual({ type: TEXT });
            expect(config.logic_operation[1]).toEqual({ type: BLOCK });
            expect(config.logic_operation[2]).toEqual({ type: TEXT });
            expect(config.logic_operation[3]).toEqual({ type: TEXT });
            expect(config.logic_operation[4]).toEqual({
                type: IMAGE,
                width: '40%',
                url: `${__webpack_public_path__}media/logic.png`,
            });
        });
    });

    describe('controls_whileUntil', () => {
        it('should have 7 items', () => {
            expect(config.controls_whileUntil).toHaveLength(7);
        });

        it('should have the correct types and example_id', () => {
            expect(config.controls_whileUntil[0]).toEqual({ type: TEXT });
            expect(config.controls_whileUntil[1]).toEqual({ type: BLOCK });
            expect(config.controls_whileUntil[2]).toEqual({ type: TEXT });
            expect(config.controls_whileUntil[3]).toEqual({ type: TEXT });
            expect(config.controls_whileUntil[4]).toEqual({ type: EXAMPLE, example_id: 'repeat_while' });
            expect(config.controls_whileUntil[5]).toEqual({ type: TEXT });
            expect(config.controls_whileUntil[6]).toEqual({ type: EXAMPLE, example_id: 'repeat_until' });
        });
    });

    describe('controls_for', () => {
        it('should have 6 items', () => {
            expect(config.controls_for).toHaveLength(6);
        });

        it('should have the correct types and example_id', () => {
            expect(config.controls_for[0]).toEqual({ type: TEXT });
            expect(config.controls_for[1]).toEqual({ type: BLOCK });
            expect(config.controls_for[2]).toEqual({ type: TEXT });
            expect(config.controls_for[3]).toEqual({ type: EXAMPLE, example_id: 'controls_for' });
            expect(config.controls_for[4]).toEqual({ type: TEXT });
            expect(config.controls_for[5]).toEqual({ type: TEXT });
        });
    });

    describe('controls_forEach', () => {
        it('should have 7 items', () => {
            expect(config.controls_forEach).toHaveLength(7);
        });

        it('should have the correct types and example_id', () => {
            expect(config.controls_forEach[0]).toEqual({ type: TEXT });
            expect(config.controls_forEach[1]).toEqual({ type: BLOCK });
            expect(config.controls_forEach[2]).toEqual({ type: TEXT });
            expect(config.controls_forEach[3]).toEqual({ type: EXAMPLE, example_id: 'controls_forEach' });
            expect(config.controls_forEach[4]).toEqual({ type: TEXT });
            expect(config.controls_forEach[5]).toEqual({ type: TEXT });
            expect(config.controls_forEach[6]).toEqual({ type: TEXT });
        });
    });

    describe('controls_flow_statements', () => {
        it('should have 7 items', () => {
            expect(config.controls_flow_statements).toHaveLength(7);
        });

        it('should have the correct types and example_id', () => {
            expect(config.controls_flow_statements[0]).toEqual({ type: TEXT });
            expect(config.controls_flow_statements[1]).toEqual({ type: BLOCK });
            expect(config.controls_flow_statements[2]).toEqual({ type: TEXT });
            expect(config.controls_flow_statements[3]).toEqual({ type: TEXT });
            expect(config.controls_flow_statements[4]).toEqual({ type: EXAMPLE, example_id: 'break_out' });
            expect(config.controls_flow_statements[5]).toEqual({ type: TEXT });
            expect(config.controls_flow_statements[6]).toEqual({ type: EXAMPLE, example_id: 'continue' });
        });
    });
});
