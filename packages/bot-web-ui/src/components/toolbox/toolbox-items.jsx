import React from 'react';
import ReactDomServer from 'react-dom/server';

const Block = ({ ...props }) => {
    props.is = 'blockly';
    return React.createElement('block', props);
};

const Category = ({ ...props }) => {
    props.is = 'blockly';
    return React.createElement('category', props);
};

const Field = ({ ...props }) => {
    props.is = 'blockly';
    return React.createElement('field', props);
};

const Mutation = ({ ...props }) => {
    props.is = 'blockly';
    return React.createElement('mutation', props);
};

const Next = ({ ...props }) => {
    props.is = 'blockly';
    return React.createElement('next', props);
};

const Shadow = ({ ...props }) => {
    props.is = 'blockly';
    return React.createElement('shadow', props);
};

const Statement = ({ ...props }) => {
    props.is = 'blockly';
    return React.createElement('statement', props);
};

const Value = ({ ...props }) => {
    props.is = 'blockly';
    return React.createElement('value', props);
};

const Xml = ({ ...props }) => {
    props.is = 'blockly';
    return React.createElement('xml', props);
};

export const ToolboxItems = ReactDomServer.renderToStaticMarkup(
    <Xml xmlns='http://www.w3.org/1999/xhtml'>
        <Category
            id='trade_parameters'
            name='Set up your trade'
            description='Choose the market, contract type, stake, duration, and barrier.'
            iconURI='IcStage1'
        >
            <Block type='trade_definition'>
                <Statement name='TRADE_OPTIONS'>
                    <Block type='trade_definition_market' deletable='false' movable='false'>
                        <Field name='MARKET_LIST'></Field>
                        <Field name='SUBMARKET_LIST'></Field>
                        <Field name='SYMBOL_LIST'></Field>
                        <Next>
                            <Block type='trade_definition_tradetype' deletable='false' movable='false'>
                                <Field name='TRADETYPECAT_LIST'></Field>
                                <Field name='TRADETYPE_LIST'></Field>
                                <Next>
                                    <Block type='trade_definition_contracttype' deletable='false' movable='false'>
                                        <Field name='TYPE_LIST'></Field>
                                        <Next>
                                            <Block
                                                type='trade_definition_candleinterval'
                                                deletable='false'
                                                movable='false'
                                            >
                                                <Field name='CANDLEINTERVAL_LIST'>60</Field>
                                                <Next>
                                                    <Block
                                                        type='trade_definition_restartbuysell'
                                                        deletable='false'
                                                        movable='false'
                                                    >
                                                        <Field name='TIME_MACHINE_ENABLED'>FALSE</Field>
                                                        <Next>
                                                            <Block
                                                                type='trade_definition_restartonerror'
                                                                deletable='false'
                                                                movable='false'
                                                            >
                                                                <Field name='RESTARTONERROR'>TRUE</Field>
                                                            </Block>
                                                        </Next>
                                                    </Block>
                                                </Next>
                                            </Block>
                                        </Next>
                                    </Block>
                                </Next>
                            </Block>
                        </Next>
                    </Block>
                </Statement>
            </Block>
            <Block type='trade_definition_tradeoptions'>
                <Mutation has_first_barrier='false' has_second_barrier='false' has_prediction='false'></Mutation>
                <Field name='DURATIONTYPE_LIST'></Field>
                <Field name='CURRENCY_LIST'>USD</Field>
                <Value name='DURATION'>
                    <Shadow type='math_number'>
                        <Field name='NUM'>1</Field>
                    </Shadow>
                </Value>
                <Value name='AMOUNT'>
                    <Shadow type='math_number'>
                        <Field name='NUM'>1</Field>
                    </Shadow>
                </Value>
            </Block>
        </Category>
        <Category
            id='purchase_conditions'
            name='Purchase contract'
            description='Define your purchase conditions.'
            iconURI='IcStage2'
        >
            <Block type='before_purchase'></Block>
            <Block type='purchase'></Block>
        </Category>
        <Category
            id='sell_conditions'
            name='Sell contract (optional)'
            description='Sell your contract at the market price.'
            iconURI='IcStage3'
        >
            <Block type='during_purchase'></Block>
            <Block type='sell_at_market'></Block>
        </Category>
        <Category
            id='trade_results'
            name='Trade again'
            description='Check your trade results and trade again.'
            iconURI='IcStage4'
        >
            <Block type='after_purchase'></Block>
            <Block type='trade_again'></Block>
        </Category>

        <Category id='analysis' name='Analysis' description='Indicators, ticks, stats, etc.' iconURI='ic-arrow'>
            <Category
                id='indicators'
                name='Indicators'
                description='Simple Moving Average, Bollinger Bands, Exponential Moving Average, etc.'
            >
                <Block type='sma_statement'>
                    <Statement name='STATEMENT'>
                        <Block type='input_list' deletable='false' movable='false'>
                            <Value name='INPUT_LIST'></Value>
                            <Next>
                                <Block type='period' deletable='false' movable='false'>
                                    <Value name='PERIOD'>
                                        <Shadow type='math_number'>
                                            <Field name='NUM'>10</Field>
                                        </Shadow>
                                    </Value>
                                </Block>
                            </Next>
                        </Block>
                    </Statement>
                </Block>
                <Block type='smaa_statement'>
                    <Statement name='STATEMENT'>
                        <Block type='input_list' deletable='false' movable='false'>
                            <Value name='INPUT_LIST'></Value>
                            <Next>
                                <Block type='period' deletable='false' movable='false'>
                                    <Value name='PERIOD'>
                                        <Shadow type='math_number'>
                                            <Field name='NUM'>10</Field>
                                        </Shadow>
                                    </Value>
                                </Block>
                            </Next>
                        </Block>
                    </Statement>
                </Block>
                <Block type='bb_statement'>
                    <Field name='BBRESULT_LIST'>0</Field>
                    <Statement name='STATEMENT'>
                        <Block type='input_list' deletable='false' movable='false'>
                            <Value name='INPUT_LIST'></Value>
                            <Next>
                                <Block type='period' deletable='false' movable='false'>
                                    <Value name='PERIOD'>
                                        <Shadow type='math_number'>
                                            <Field name='NUM'>10</Field>
                                        </Shadow>
                                    </Value>
                                    <Next>
                                        <Block type='std_dev_multiplier_up' deletable='false' movable='false'>
                                            <Value name='UPMULTIPLIER'>
                                                <Shadow type='math_number'>
                                                    <Field name='NUM'>5</Field>
                                                </Shadow>
                                            </Value>
                                            <Next>
                                                <Block type='std_dev_multiplier_down'>
                                                    <Value name='DOWNMULTIPLIER'>
                                                        <Shadow type='math_number'>
                                                            <Field name='NUM'>5</Field>
                                                        </Shadow>
                                                    </Value>
                                                </Block>
                                            </Next>
                                        </Block>
                                    </Next>
                                </Block>
                            </Next>
                        </Block>
                    </Statement>
                </Block>
                <Block type='bba_statement'>
                    <Field name='BBRESULT_LIST'>0</Field>
                    <Statement name='STATEMENT'>
                        <Block type='input_list' deletable='false' movable='false'>
                            <Value name='INPUT_LIST'></Value>
                            <Next>
                                <Block type='period' deletable='false' movable='false'>
                                    <Value name='PERIOD'>
                                        <Shadow type='math_number'>
                                            <Field name='NUM'>10</Field>
                                        </Shadow>
                                    </Value>
                                    <Next>
                                        <Block type='std_dev_multiplier_up' deletable='false' movable='false'>
                                            <Value name='UPMULTIPLIER'>
                                                <Shadow type='math_number'>
                                                    <Field name='NUM'>5</Field>
                                                </Shadow>
                                            </Value>
                                            <Next>
                                                <Block type='std_dev_multiplier_down'>
                                                    <Value name='DOWNMULTIPLIER'>
                                                        <Shadow type='math_number'>
                                                            <Field name='NUM'>5</Field>
                                                        </Shadow>
                                                    </Value>
                                                </Block>
                                            </Next>
                                        </Block>
                                    </Next>
                                </Block>
                            </Next>
                        </Block>
                    </Statement>
                </Block>
                <Block type='ema_statement'>
                    <Statement name='STATEMENT'>
                        <Block type='input_list' deletable='false' movable='false'>
                            <Value name='INPUT_LIST'></Value>
                            <Next>
                                <Block type='period' deletable='false' movable='false'>
                                    <Value name='PERIOD'>
                                        <Shadow type='math_number'>
                                            <Field name='NUM'>10</Field>
                                        </Shadow>
                                    </Value>
                                </Block>
                            </Next>
                        </Block>
                    </Statement>
                </Block>
                <Block type='emaa_statement'>
                    <Statement name='STATEMENT'>
                        <Block type='input_list' deletable='false' movable='false'>
                            <Value name='INPUT_LIST'></Value>
                            <Next>
                                <Block type='period' deletable='false' movable='false'>
                                    <Value name='PERIOD'>
                                        <Shadow type='math_number'>
                                            <Field name='NUM'>10</Field>
                                        </Shadow>
                                    </Value>
                                </Block>
                            </Next>
                        </Block>
                    </Statement>
                </Block>
                <Block type='rsi_statement'>
                    <Statement name='STATEMENT'>
                        <Block type='input_list' deletable='false' movable='false'>
                            <Next>
                                <Block type='period' deletable='false' movable='false'>
                                    <Value name='PERIOD'>
                                        <Shadow type='math_number'>
                                            <Field name='NUM'>10</Field>
                                        </Shadow>
                                    </Value>
                                </Block>
                            </Next>
                        </Block>
                    </Statement>
                </Block>
                <Block type='rsia_statement'>
                    <Statement name='STATEMENT'>
                        <Block type='input_list' deletable='false' movable='false'>
                            <Value name='INPUT_LIST'></Value>
                            <Next>
                                <Block type='period' deletable='false' movable='false'>
                                    <Value name='PERIOD'>
                                        <Shadow type='math_number'>
                                            <Field name='NUM'>10</Field>
                                        </Shadow>
                                    </Value>
                                </Block>
                            </Next>
                        </Block>
                    </Statement>
                </Block>
                <Block type='macda_statement'>
                    <Field name='MACDFIELDS_LIST'>1</Field>
                    <Statement name='STATEMENT'>
                        <Block type='input_list' deletable='false' movable='false'>
                            <Value name='INPUT_LIST'></Value>
                            <Next>
                                <Block type='fast_ema_period' deletable='false' movable='false'>
                                    <Value name='FAST_EMA_PERIOD'>
                                        <Block type='math_number'>
                                            <Field name='NUM'>12</Field>
                                        </Block>
                                    </Value>
                                    <Next>
                                        <Block type='slow_ema_period' deletable='false' movable='false'>
                                            <Value name='SLOW_EMA_PERIOD'>
                                                <Block type='math_number'>
                                                    <Field name='NUM'>26</Field>
                                                </Block>
                                            </Value>
                                            <Next>
                                                <Block type='signal_ema_period' deletable='false' movable='false'>
                                                    <Value name='SIGNAL_EMA_PERIOD'>
                                                        <Block type='math_number'>
                                                            <Field name='NUM'>9</Field>
                                                        </Block>
                                                    </Value>
                                                </Block>
                                            </Next>
                                        </Block>
                                    </Next>
                                </Block>
                            </Next>
                        </Block>
                    </Statement>
                </Block>
            </Category>

            <Category name='Tick and candle analysis' id='tick_analysis' description='Tools for tick analysis'>
                <Block type='tick_analysis'></Block>
                <Block type='tick'></Block>
                <Block type='last_digit'></Block>
                <Block type='ticks'></Block>
                <Block type='lastDigitList'></Block>
                <Block type='check_direction'></Block>
                <Block type='is_candle_black'></Block>
                <Block type='read_ohlc'>
                    <Field name='OHLCFIELD_LIST'>open</Field>
                    <Field name='CANDLEINTERVAL_LIST'>default</Field>
                    <Value name='CANDLEINDEX'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>1</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='read_ohlc_obj'></Block>
                <Block type='ohlc_values'></Block>
                <Block type='ohlc_values_in_list'></Block>
                <Block type='get_ohlc'>
                    <Field name='CANDLEINTERVAL_LIST'>default</Field>
                    <Value name='CANDLEINDEX'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>1</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='ohlc'></Block>
            </Category>

            <Category name='Contract' id='contract_details' description='Contract details'>
                <Block type='contract_check_result'></Block>
                <Block type='read_details'></Block>
                <Block type='sell_price'></Block>
                <Block type='check_sell'></Block>
                <Block type='payout'></Block>
                <Block type='ask_price'></Block>
            </Category>

            <Category name='Stats' id='stats' description='Run time statistics'>
                <Block type='balance'></Block>
                <Block type='total_profit'></Block>
                <Block type='total_runs'></Block>
            </Category>
        </Category>

        <Category id='utility' name='Utility' description='Math, text, logic, lists, etc.' iconURI='ic-arrow'>
            <Category
                name='Custom functions'
                id='custom_functions'
                description='Create your own functions'
                dynamic='PROCEDURE'
            ></Category>

            <Category
                name='Variables'
                id='variables'
                description='Create and name memory locations to store values'
                dynamic='VARIABLE'
            ></Category>

            <Category name='Notifications' id='notifications' description='Create notification messages'>
                <Block type='text_print'>
                    <Value name='TEXT'>
                        <Shadow type='text'>
                            <Field name='TEXT'>abc</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='text_prompt_ext'>
                    <Field name='TYPE'>TEXT</Field>
                    <Value name='TEXT'>
                        <Shadow type='text'>
                            <Field name='TEXT'>abc</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='notify'>
                    <Field name='NOTIFICATION_TYPE'>success</Field>
                    <Value name='MESSAGE'>
                        <Shadow type='text'>
                            <Field name='TEXT'>abc</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='notify_telegram'>
                    <Value name='TELEGRAM_ACCESS_TOKEN'>
                        <Shadow type='text'>
                            <Field name='TEXT'></Field>
                        </Shadow>
                    </Value>
                    <Value name='TELEGRAM_CHAT_ID'>
                        <Shadow type='text'>
                            <Field name='TEXT'></Field>
                        </Shadow>
                    </Value>
                    <Value name='TELEGRAM_MESSAGE'>
                        <Shadow type='text'>
                            <Field name='TEXT'>abc</Field>
                        </Shadow>
                    </Value>
                </Block>
            </Category>

            <Category name='Time' id='time' description='Time-based blocks'>
                <Block type='epoch' />
                <Block type='timeout' />
                <Block type='totimestamp'>
                    <Value name='DATETIME'>
                        <Shadow type='text'>
                            <Field name='TEXT'>yyyy-mm-dd hh:mm:ss</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='todatetime'>
                    <Value name='TIMESTAMP'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>0</Field>
                        </Shadow>
                    </Value>
                </Block>
            </Category>

            <Category name='Math' id='math' description='Arithmetical operations'>
                <Block type='math_number' />
                <Block type='math_arithmetic'>
                    <Field name='OP'>ADD</Field>
                    <Value name='A'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>1</Field>
                        </Shadow>
                    </Value>
                    <Value name='B'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>1</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='math_single'>
                    <Field name='OP'>ROOT</Field>
                    <Value name='NUM'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>9</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='math_trig'>
                    <Field name='OP'>SIN</Field>
                    <Value name='NUM'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>45</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='math_constant' />
                <Block type='math_number_property'>
                    <Mutation divisor_input='false'></Mutation>
                    <Field name='PROPERTY'>EVEN</Field>
                    <Value name='NUMBER_TO_CHECK'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>0</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='math_change'>
                    <Field name='VAR' variabletype=''>
                        item
                    </Field>
                    <Value name='DELTA'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>1</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='math_on_list' />
                <Block type='math_round'>
                    <Field name='OP'>ROUND</Field>
                    <Value name='NUM'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>3.1</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='math_modulo'>
                    <Value name='DIVIDEND'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>64</Field>
                        </Shadow>
                    </Value>
                    <Value name='DIVISOR'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>10</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='math_constrain'>
                    <Value name='Value'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>50</Field>
                        </Shadow>
                    </Value>
                    <Value name='LOW'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>1</Field>
                        </Shadow>
                    </Value>
                    <Value name='HIGH'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>100</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='math_random_int'>
                    <Value name='FROM'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>1</Field>
                        </Shadow>
                    </Value>
                    <Value name='TO'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>100</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='math_random_float' />
            </Category>

            <Category name='Text' id='text' description='Operations with text strings'>
                <Block type='text'>
                    <Field name='TEXT'>abc</Field>
                </Block>
                <Block type='text_join'>
                    <Field name='VARIABLE' variabletype=''>
                        text
                    </Field>
                    <Statement name='STACK'>
                        <Block type='text_statement' movable='false'>
                            <Value name='TEXT'>
                                <Shadow type='text'>
                                    <Field name='TEXT'>abc</Field>
                                </Shadow>
                            </Value>
                        </Block>
                    </Statement>
                </Block>
                <Block type='text_append'>
                    <Field name='VAR' variabletype=''>
                        text
                    </Field>
                    <Value name='TEXT'>
                        <Shadow type='text'>
                            <Field name='TEXT'>abc</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='text_length'>
                    <Value name='Value'>
                        <Shadow type='text'>
                            <Field name='TEXT'>abc</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='text_isEmpty'>
                    <Value name='Value'>
                        <Shadow type='text'>
                            <Field name='TEXT'></Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='text_indexOf'>
                    <Field name='END'>FIRST</Field>
                    <Value name='Value'>
                        <Block type='variables_get'>
                            <Field name='VAR' variabletype=''>
                                text
                            </Field>
                        </Block>
                    </Value>
                    <Value name='FIND'>
                        <Shadow type='text'>
                            <Field name='TEXT'>abc</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='text_charAt'>
                    <Mutation at='true'></Mutation>
                    <Field name='WHERE'>FROM_START</Field>
                    <Value name='Value'>
                        <Block type='variables_get'>
                            <Field name='VAR' variabletype=''>
                                item
                            </Field>
                        </Block>
                    </Value>
                    <Value name='AT'>
                        <Shadow type='math_number_positive'>
                            <Field name='NUM'>1</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='text_getSubstring'>
                    <Mutation at1='true' at2='true'></Mutation>
                    <Field name='WHERE1'>FROM_START</Field>
                    <Field name='WHERE2'>FROM_START</Field>
                    <Value name='STRING'>
                        <Block type='variables_get'>
                            <Field name='VAR' variabletype=''>
                                text
                            </Field>
                        </Block>
                    </Value>
                    <Value name='AT1'>
                        <Shadow type='math_number_positive'>
                            <Field name='NUM'>0</Field>
                        </Shadow>
                    </Value>
                    <Value name='AT2'>
                        <Shadow type='math_number_positive'>
                            <Field name='NUM'>2</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='text_changeCase'>
                    <Field name='CASE'>UPPERCASE</Field>
                    <Value name='TEXT'>
                        <Shadow type='text'>
                            <Field name='TEXT'>abc</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='text_trim'>
                    <Field name='MODE'>BOTH</Field>
                    <Value name='TEXT'>
                        <Shadow type='text'>
                            <Field name='TEXT'>abc</Field>
                        </Shadow>
                    </Value>
                </Block>
            </Category>

            <Category name='Logic' id='logic' description='Logic comparison blocks'>
                <Block type='controls_if' />
                <Block type='logic_compare' />
                <Block type='logic_operation' />
                <Block type='logic_negate' />
                <Block type='logic_boolean' />
                <Block type='logic_null' />
                <Block type='logic_ternary' />
            </Category>

            <Category name='Lists' id='lists' description='List-related blocks'>
                <Block type='lists_create_with'>
                    <Field name='VARIABLE' variabletype=''>
                        list
                    </Field>
                    <Statement name='STACK'>
                        <Block type='lists_statement' movable='false'>
                            <Next>
                                <Block type='lists_statement' movable='false'></Block>
                            </Next>
                        </Block>
                    </Statement>
                </Block>
                <Block type='lists_repeat'>
                    <Value name='NUM'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>5</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='lists_length'></Block>
                <Block type='lists_isEmpty'></Block>
                <Block type='lists_indexOf'></Block>
                <Block type='lists_getIndex'></Block>
                <Block type='lists_setIndex'></Block>
                <Block type='lists_getSublist'></Block>
                <Block type='lists_split'>
                    <Mutation mode='SPLIT'></Mutation>
                    <Field name='MODE'>SPLIT</Field>
                    <Value name='DELIM'>
                        <Shadow type='text'>
                            <Field name='TEXT'>,</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='lists_sort'></Block>
            </Category>

            <Category name='Loops' id='loops' description='Create repetitive instructions'>
                <Block type='controls_repeat'></Block>
                <Block type='controls_repeat_ext'></Block>
                <Block type='controls_whileUntil'></Block>
                <Block type='controls_for'></Block>
                <Block type='controls_forEach'></Block>
                <Block type='controls_flow_statements'></Block>
            </Category>

            <Category name='Miscellaneous' id='misc' description='Miscellaneous blocks'>
                <Block type='loader'></Block>
                <Block type='block_holder'></Block>
                <Block type='console'>
                    <Value name='MESSAGE'>
                        <Shadow type='text'>
                            <Field name='TEXT'>abc</Field>
                        </Shadow>
                    </Value>
                </Block>
            </Category>
        </Category>
    </Xml>
);
