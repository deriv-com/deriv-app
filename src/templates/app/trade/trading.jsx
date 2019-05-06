import React from 'react';
import Analysis from './analysis.jsx';
import Portfolio from '../user/portfolio.jsx';
import Loading from '../../_common/components/loading.jsx';

const Trading = () => (
    <React.Fragment>
        <div id='trading_socket_container'>
            <div id='notifications_wrapper' />
            <div id='loading_container' className='overlay_container' />
            <a id='deposit_btn_trade' className='client_real invisible gr-hide-m button' href={it.url_for('cashier/forwardws?action=deposit')}>
                <span>
                    <img src={it.url_for('images/common/plus.svg')} />
                    {it.L('Deposit')}
                </span>
            </a>
            <div className='client_virtual invisible'>
                <div id='upgrade_btn_trade' className='invisible upgrademessage gr-hide-m'>
                    <a className='button' />
                </div>
            </div>
            <div className='client_virtual client_logged_out invisible' id='guideBtn' />
            <div className='row' id='contract_symbol_container'>
                <div id='contract_markets_container'>
                    <div id='underlying_component' />
                    <input type='hidden' id='underlying' />
                </div>
                <div id='contract_type_container'>
                    <div id='contract_component' />
                    <input type='hidden' id='contract' />
                </div>
                <div id='underlying_details'>
                    <span id='trading_worm_chart' />
                    <span id='spot' />
                </div>
                <a id='symbol_tip' target='_blank'>&#9432;</a>
            </div>
            <div className='row clear' id='contract_form_content_wrapper'>
                <div className='col row-inner gr-6 gr-12-p gr-12-m gr-no-gutter'>
                    <div id='contract_container' className='col row'>
                        <div id='loading_container3' className='overlay_container' />
                        <div id='contract_form_container' className='col'>
                            <div id='contract_form_content' className='gr-gutter'>
                                <form id='websocket_form'>
                                    <div className='row' id='date_start_row'>
                                        <div className='col form_label' id='start_time_label'>{it.L('Start time')}</div>
                                        <div className='big-col'>
                                            <select id='date_start' />
                                            <div id='time_start_row' className='invisible'>
                                                <input type='text' data-lpignore='true' id='time_start' autoComplete='off' readOnly='readonly' className='medium_width_input' />
                                                <span className='gr-gutter-left'>GMT</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row' id='expiry_row'>
                                        <div className='col form_label'>
                                            <select id='expiry_type' />
                                        </div>
                                        <div className='big-col'>
                                            <div id='expiry_type_duration'>
                                                <input id='duration_amount' type='number' className='small_width_input' autoComplete='off' /><label />
                                                <select id='duration_units' className='medium_width_input' />
                                            </div>
                                            <div id='duration_wrapper' className='hint'>
                                                <span id='duration_tooltip'>{it.L('Minimum:')}</span> <span id='duration_minimum' />
                                                <span id='duration_maximum' className='invisible' />
                                            </div>
                                            <div id='expiry_type_endtime'>
                                                <input id='expiry_date' type='text' data-lpignore='true' readOnly='readonly' autoComplete='off' />
                                                <div id='expiry_time_row'>
                                                    <input id='expiry_time' type='text' data-lpignore='true' autoComplete='off' readOnly='readonly' className='medium_width_input' />
                                                    <span className='gr-gutter-left'>GMT</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row' id='highlowticks_expiry_row'>
                                        <div className='col form_label'>
                                            <label>{it.L('Duration')}</label>
                                        </div>
                                        <div className='big-col'>
                                            <label className='gr-gutter'>5</label>
                                            <label className='gr-gutter-left'>{it.L('Ticks')}</label>
                                            <div className='hint'>{it.L('This contract type only offers 5 ticks')}</div>
                                        </div>
                                    </div>
                                    <div className='row barrier_class' id='barrier_row'>
                                        <div className='col form_label'>
                                            <label htmlFor='H' id='barrier_label'>
                                                <span id='barrier_tooltip'>{it.L('Barrier offset')}</span>
                                                <span id='barrier_span'>{it.L('Barrier')}</span>
                                            </label>
                                        </div>
                                        <div className='big-col'>
                                            <input id='barrier' type='text' data-lpignore='true' name='H' autoComplete='off' />
                                            <span id='indicative_barrier_tooltip' data-balloon={it.L('This is an indicative barrier. Actual barrier will be the entry spot plus the barrier offset.')} data-balloon-length='xlarge' />
                                        </div>
                                    </div>
                                    <div className='row barrier_class' id='high_barrier_row'>
                                        <div className='col form_label'>
                                            <label htmlFor='H' id='barrier_high_label'>
                                                <span id='barrier_high_tooltip'>{it.L('High barrier offset')}</span>
                                                <span id='barrier_high_span'>{it.L('High barrier')}</span>
                                            </label>
                                        </div>
                                        <div className='big-col'>
                                            <input id='barrier_high' type='text' data-lpignore='true' name='H' autoComplete='off' />
                                            <span id='indicative_high_barrier_tooltip' data-balloon={it.L('This is an indicative barrier. Actual barrier will be the entry spot plus the barrier offset.')} data-balloon-length='xlarge' />
                                            <div className='hint'>
                                                <span id='barrier_high_error' className='error-msg invisible'>{it.L('High barrier must be higher than low barrier')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row barrier_class' id='low_barrier_row'>
                                        <div className='col form_label'>
                                            <label htmlFor='L' id='barrier_low_label'>
                                                <span id='barrier_low_tooltip'>{it.L('Low barrier offset')}</span>
                                                <span id='barrier_low_span'>{it.L('Low barrier')}</span>
                                            </label>
                                        </div>
                                        <div className='big-col'>
                                            <input id='barrier_low' type='text' data-lpignore='true' name='L' autoComplete='off' />
                                            <span id='indicative_low_barrier_tooltip' data-balloon={it.L('This is an indicative barrier. Actual barrier will be the entry spot plus the barrier offset.')} data-balloon-length='xlarge' />
                                        </div>
                                    </div>
                                    <div className='row' id='prediction_row'>
                                        <div className='col form_label'>
                                            <label htmlFor='prediction' id='prediction_label'>{it.L('Last Digit Prediction')}</label>
                                        </div>
                                        <div className='big-col'>
                                            <select id='prediction' className='small_width_input'>
                                                { Array.from(new Array(10)).map((x, idx) => (
                                                    <option key={idx} value={idx}>{idx}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className='row' id='selected_tick_row'>
                                        <div className='col form_label'>
                                            <label htmlFor='selected_tick' id='selected_tick_label'>{it.L('Tick Prediction')}</label>
                                        </div>
                                        <div className='big-col'>
                                            <select id='selected_tick' className='small_width_input'>
                                                { Array.from(new Array(5)).map((x, idx) => (
                                                    <option key={idx + 1} value={idx + 1}>{idx + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className='row' id='multiplier_row'>
                                        <div className='col form_label'>
                                            <label htmlFor='multiplier' id='multiplier_label'>{it.L('Multiplier')}</label>
                                        </div>
                                        <div className='row-inner big-col'>
                                            <div className='col-inner'>
                                                <select id='multiplier_currency' className='currency small_width_input' />
                                                <input type='text' data-lpignore='true' defaultValue='1' step='any' maxLength='10' name='multiplier' id='multiplier' className='small_width_input' />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row' id='payout_row'>
                                        <div className='col form_label'>
                                            <select id='amount_type'>
                                                <option value='stake' id='stake_option'>{it.L('Stake')}</option>
                                                <option value='payout' id='payout_option'>{it.L('Payout')}</option>
                                            </select>
                                        </div>
                                        <div className='row-inner big-col'>
                                            <div className='col-inner'>
                                                <select id='currency' className='currency small_width_input' />
                                                <input id='amount' type='text' data-lpignore='true' step='any' maxLength='10' className='medium_width_input' autoComplete='off' />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row' id='reset_time' />
                                    <div className='row invisible' id='equals_row'>
                                        <input id='callputequal' type='checkbox' />
                                        <label htmlFor='callputequal'><span data-balloon={it.L('Win payout if exit spot is also equal to entry spot.')}>{it.L('Allow equals')}</span></label>
                                    </div>
                                </form>
                            </div>
                            <div id='open_positions_container'>
                                <Portfolio />
                            </div>
                        </div>
                    </div>
                </div>
                <div id='contract_prices_container' className='col row-inner gr-6 gr-12-p gr-12-m gr-no-gutter'>
                    <div id='contract_confirmation_container' className='overlay_container col'>
                        <a className='close' id='close_confirmation_container' />
                        <div id='confirmation_message_container'>
                            <div id='confirmation_message'>
                                <h3 id='contract_purchase_heading' />
                                <div id='contract_purchase_descr' />
                                <div className='row' id='contract_purchase_profit_list'>
                                    <div className='col' id='contract_purchase_payout' />
                                    <div className='col' id='contract_purchase_cost' />
                                    <div className='col' id='contract_purchase_profit' />
                                </div>
                                <div id='contract_purchase_barrier' />
                                <div id='contract_purchase_reference' />
                                <div className='button'>
                                    <span id='contract_purchase_button' className='button open_contract_details' />
                                </div>
                                <div id='contract_purchase_spots' />
                                <div id='trade_tick_chart' />
                                <div id='digit_ticker_table' className='digit-ticker invisible' />
                                <div id='contract_purchase_balance' />
                            </div>
                            <div id='confirmation_error' className='center-text invisible' />
                            <div id='authorization_error_container' className='center-text invisible'>
                                <div className='authorization_error'>
                                    <h3 id='authorization_error_text'>{it.L('Ready to trade?')}</h3>
                                    <a className='button' href={it.url_for('new-account')}>
                                        <span>{it.L('Open a free account')}</span>
                                    </a>
                                    <p>{it.L('Already have an account?')}</p>
                                    <a id='authorization_error_btn_login' href='javascript:;'>{it.L('Log in here')}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row-inner' id='contracts_list'>
                        <div id='loading_container2' className='overlay_container' />
                        <div className='col price_container row-inner' id='price_container_top'>
                            <div className='col gr-row'>
                                <div className='price_wrapper row'>
                                    <h4 className='contract_heading' />
                                    <span className='amount_wrapper'>
                                        <div className='amount_wrapper_div'>
                                            <div className='stake_wrapper'>
                                                <span className='stake' />
                                                <span className='contract_amount' />
                                            </div>
                                            <div className='payout_wrapper'>
                                                <span className='payout' />
                                                <span className='contract_payout' />
                                            </div>
                                        </div>
                                        <div className='contract_purchase button'>
                                            <span className='purchase_button contract_description no-underline' id='purchase_button_top' data-balloon-length='xlarge' value='purchase'>{it.L('Purchase')}</span>
                                        </div>
                                    </span>
                                </div>
                            </div>
                            <div className='col price_comment' />
                            <div className='col contract_error' />
                        </div>
                        <div className='col price_container row-inner' id='price_container_bottom'>
                            <div className='col gr-row'>
                                <div className='price_wrapper row'>
                                    <h4 className='contract_heading' />
                                    <span className='amount_wrapper'>
                                        <div className='amount_wrapper_div'>
                                            <div className='stake_wrapper'>
                                                <span className='stake' />
                                                <span className='contract_amount' />
                                            </div>
                                            <div className='payout_wrapper'>
                                                <span className='payout' />
                                                <span className='contract_payout' />
                                            </div>
                                        </div>
                                        <div className='contract_purchase button'>
                                            <span className='purchase_button contract_description no-underline' id='purchase_button_bottom' data-balloon-length='xlarge' value='purchase'>{it.L('Purchase')}</span>
                                        </div>
                                    </span>
                                </div>
                            </div>
                            <div className='col price_comment' />
                            <div className='col contract_error' />
                        </div>
                        <div className='col price_container row-inner' id='price_container_middle'>
                            <div className='col gr-row'>
                                <div className='price_wrapper row'>
                                    <h4 className='contract_heading' />
                                    <span className='amount_wrapper'>
                                        <div className='amount_wrapper_div'>
                                            <div className='stake_wrapper'>
                                                <span className='stake' />
                                                <span className='contract_amount' />
                                            </div>
                                            <div className='payout_wrapper'>
                                                <span className='multiplier' />
                                                <span className='contract_multiplier' />
                                            </div>
                                        </div>
                                        <div className='contract_purchase button'>
                                            <span className='purchase_button no-underline' id='purchase_button_middle' data-balloon-length='xlarge' value='purchase'>{it.L('Purchase')}</span>
                                        </div>
                                    </span>
                                </div>
                                <div className='contract_longcode' />
                            </div>
                            <div className='col price_comment' />
                            <div className='col contract_error' />
                        </div>
                    </div>
                </div>
            </div>
            <div id='all_prices' />
            <Analysis />
        </div>
        <div id='trading_init_progress'>
            <Loading />
        </div>
    </React.Fragment>
);

export default Trading;
