import constant from '../../constants';

const { help: { TEXT, IMAGE, BLOCK } } = constant;

export const config = {
//= ================= Functions ==================
    procedures_ifreturn: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: IMAGE, width: '60%', url: `${__webpack_public_path__}media/if-return.png` }, // eslint-disable-line
    ],
    //= ================= Math ==================
    math_arithmetic: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
    ], math_single: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
    ], math_constrain: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
        { type: IMAGE, width: '60%', url: `${__webpack_public_path__}media/constrain.png` }, // eslint-disable-line
    ],
    // math_number: [
    //     { type: VIDEO, url: 'https://www.youtube.com/embed/Bb0HnaYNUx4' },
    //     { type: TEXT },
    //     { type: IMAGE, url: 'https://d2.alternativeto.net/dist/s/scratch_830736_full.png?format=jpg&width=1600&height=1600&mode=min&upscale=false' },
    //     { type: VIDEO, url: 'https://www.youtube.com/embed/mi18spqE7R4?controls=0' },
    //     { type: BLOCK },
    //     { type: TEXT },
    //     { type: IMAGE, url: 'https://d2.alternativeto.net/dist/s/scratch_830736_full.png?format=jpg&width=1600&height=1600&mode=min&upscale=false' },
    // ],
    //= ================= Text ==================
    text_print: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
    ], text_prompt_ext: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
    ],
    //= ================= Tick analysis ==================
    tick_analysis: [
        { type: TEXT },
        { type: BLOCK },
    ], read_details: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
    ],
    last_digit: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
    ], read_ohlc: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: IMAGE, width: '100%', url: `${__webpack_public_path__}media/in_candle_list_read.png` }, // eslint-disable-line
    ], read_ohlc_obj: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
        { type: IMAGE, width: '100%', url: `${__webpack_public_path__}media/read_candle_value.png` }, // eslint-disable-line
    ], check_direction: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
    ], get_ohlc: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
        { type: IMAGE, width: '100%', url: `${__webpack_public_path__}media/get_candle.png` }, // eslint-disable-line
        { type: TEXT },
    ], ohlc: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
        { type: IMAGE, width: '100%', url: `${__webpack_public_path__}media/candle_list_1.png` }, // eslint-disable-line
    ], ohlc_values: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: IMAGE, url: `${__webpack_public_path__}media/candle_list.png` }, // eslint-disable-line
        { type: TEXT },
    ], is_candle_black: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: IMAGE, width: '100%', url: `${__webpack_public_path__}media/is_candle_black.jpeg` }, // eslint-disable-line
        { type: TEXT },
        { type: IMAGE, width: '100%', url: `${__webpack_public_path__}media/is_candle_black_1.jpeg` }, // eslint-disable-line
        { type: TEXT },
    ], ohlc_values_in_list: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: IMAGE, width: '100%', url: `${__webpack_public_path__}media/candle_list_1.png` }, // eslint-disable-line
    ],
    //= ================= Variables ==================
    variables_gets: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
    ], variables_set: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
    ],
    // =============== Time blocks ============
    epoch: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: IMAGE, width: '100%', url: `${__webpack_public_path__}media/epoch.png` }, // eslint-disable-line
    ],
    todatetime: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: IMAGE, width: '100%', url: `${__webpack_public_path__}media/todatetime.png` }, // eslint-disable-line
        { type: TEXT },
    ],
    totimestamp: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: IMAGE, width: '100%', url: `${__webpack_public_path__}media/totimestamp.png` }, // eslint-disable-line
        { type: TEXT },
    ],
    // =============== Notifications blocks ============
    notify_telegram: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: IMAGE, url: `${__webpack_public_path__}media/notify_telegram.png` }, // eslint-disable-line
    ],
    // =============== Misc blocks ============
    balance: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
    ],
    // =============== Indicators blocks ============
    sma_statement: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: IMAGE, width: '60%', url: `${__webpack_public_path__}media/sma_formula.png` }, // eslint-disable-line
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: IMAGE, width: '100%', url: `${__webpack_public_path__}media/sma_chart_1.png` }, // eslint-disable-line
        { type: TEXT },
        { type: IMAGE, width: '100%', url: `${__webpack_public_path__}media/sma_chart_2.png` }, // eslint-disable-line
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: IMAGE, width: '100%', url: `${__webpack_public_path__}media/sma_block_example.png` }, // eslint-disable-line
        { type: TEXT },
        { type: TEXT },
        { type: IMAGE, width: '70%', url: `${__webpack_public_path__}media/sma_block_example_1.png` }, // eslint-disable-line
        { type: TEXT },
        { type: TEXT },
        { type: IMAGE, width: '100%', url: `${__webpack_public_path__}media/sma_array.png` }, // eslint-disable-line
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: IMAGE, width: '100%', url: `${__webpack_public_path__}media/sma_array_explanation.jpeg` }, // eslint-disable-line

    ],
    // =============== Root blocks ============
    trade_definition: [
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
        { type: BLOCK },
    ],
    trade_definition_tradeoptions: [
        { type: TEXT },
        { type: BLOCK },
    ],
    before_purchase: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
    ],
    during_purchase: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: IMAGE, width: '70%', url: `${__webpack_public_path__}media/sell_available.png` }, // eslint-disable-line
    ],
    sell_at_market: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: IMAGE, width: '70%', url: `${__webpack_public_path__}media/sell_available.png` }, // eslint-disable-line
    ],
    after_purchase: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
    ],
    trade_again: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: IMAGE, width: '70%', url: `${__webpack_public_path__}media/trade_again.png` }, // eslint-disable-line
    ],
    // =============== Contract ============
    contract_check_result: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
        { type: IMAGE, width: '70%', url: `${__webpack_public_path__}media/check_result.png` }, // eslint-disable-line
    ], sell_price: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: IMAGE, width: '70%', url: `${__webpack_public_path__}media/sell_pl.png` }, // eslint-disable-line
    ],
    // =============== Logic ============
    controls_if: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: IMAGE, width: '70%', url: `${__webpack_public_path__}media/controls_if.png` }, // eslint-disable-line
        { type: TEXT },
        { type: IMAGE, width: '40%', url: `${__webpack_public_path__}media/compare_logic.png` }, // eslint-disable-line
    ],
    logic_operation: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
        { type: IMAGE, width: '40%', url: `${__webpack_public_path__}media/logic.png` }, // eslint-disable-line
    ],
    // =============== Logic ============
    controls_whileUntil: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
        { type: IMAGE, width: '80%', url: `${__webpack_public_path__}media/repeat_while.png` }, // eslint-disable-line
        { type: TEXT },
        { type: IMAGE, width: '80%', url: `${__webpack_public_path__}media/repeat_until.png` }, // eslint-disable-line
    ],
    controls_for: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: IMAGE, width: '80%', url: `${__webpack_public_path__}media/controls_for.png` }, // eslint-disable-line
        { type: TEXT },
        { type: TEXT },
    ],
    controls_forEach: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: IMAGE, width: '80%', url: `${__webpack_public_path__}media/controls_forEach.png` }, // eslint-disable-line
        { type: TEXT },
        { type: TEXT },
        { type: TEXT },
    ],
    controls_flow_statements: [
        { type: TEXT },
        { type: BLOCK },
        { type: TEXT },
        { type: TEXT },
        { type: IMAGE, width: '80%', url: `${__webpack_public_path__}media/break_out.png` }, // eslint-disable-line
        { type: TEXT },
        { type: IMAGE, width: '80%', url: `${__webpack_public_path__}media/continue.png` }, // eslint-disable-line
    ],
};

