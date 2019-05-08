import React from 'react';
import Analysis from './analysis.jsx';
import Loading from '../../_common/components/loading.jsx';
import Portfolio from '../user/portfolio.jsx';

const BuySellTemplate = () => (
    <React.Fragment>
        <div className='buy-price gr-12 gr-no-gutter-left'>
            <button className='price-button'>
                <span className='value-wrapper'>
                    <span className='dynamics' />
                    <span className='value' />
                </span>
                <span className='base-value invisible' />
            </button>
        </div>
    </React.Fragment>
);

const FormItem = ({
    class_current = '',
    class_list = '',
    className,
    exclude_current,
    exclude_list,
    id,
    children,
}) => (
    <div id={id} className={className}>
        {!exclude_current && <div className={`current ${class_current}`} />}
        {!exclude_list && <div className={`list invisible ${class_list}`}>{children}</div>}
    </div>
);

const MBTrading = () => (
    <React.Fragment>
        <div id='main_loading' className='center-text'>
            <Loading />
        </div>
        <div id='mb-trading-wrapper' className='mb-trading-wrapper gr-centered gr-12-p gr-12-m invisible'>
            <div className='gr-row'>

                <div className='gr-7 gr-12-m gr-12-p gr-order-2-m gr-order-2-p' id='chart_wrapper'>
                    <p className='error-msg' id='chart-error' />
                    <div id='trade_live_chart'>
                        <div id='webtrader_chart' />
                    </div>
                </div>

                <div className='gr-5 gr-12-m gr-12-p gr-no-gutter-left gr-gutter-left-p gr-gutter-left-m'>
                    <div id='mb_trading' className='gr-12'>

                        <div id='notifications_wrapper' className='gr-row'>
                            <div id='login_error_container' className='center-text invisible'>
                                <div className='login_error'>
                                    <h3 id='login_error_text'>{it.L('Ready to trade?')}</h3>
                                    <a className='button' href={it.url_for('new-account')}>
                                        <span>{it.L('Open a free account')}</span>
                                    </a>
                                    <p>{it.L('Already have an account?')}</p>
                                    <a id='login_error_btn_login' href='javascript:;'>{it.L('Log in here')}</a>
                                </div>
                            </div>
                        </div>

                        <div id='panel'>
                            <div className='selection_wrapper less-margin-top'>
                                <div className='trade_form'>
                                    <FormItem id='underlying' class_current='gr-row' class_list='gr-row' />
                                </div>
                            </div>
                            <div className='gr-row selection_wrapper'>
                                <div className='gr-12 gr-no-gutter'>
                                    <div className='gr-row'>
                                        <div className='gr-3 gr-6-m gr-no-gutter gr-12-m gr-order-2-m'>
                                            <div className='trade_form'>
                                                <div id='payout_amount'>{it.L('Payout')}</div>
                                            </div>
                                            <div className='trade_form gr-12 no-margin'>
                                                <div className='gr-row'>
                                                    <FormItem id='currency' className='gr-5 gr-no-gutter' class_current='gr-row' class_list='gr-5 gr-no-gutter' />
                                                    <input data-lpignore='true' className='gr-7 center-text gr-no-gutter' type='text' id='payout' maxLength='15' />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='trade_form gr-9 gr-6-m gr-no-gutter-right gr-12-m gr-no-gutter-left-m'>
                                            <div className='header-current'>
                                                <div className='gr-row'>
                                                    <span className='nav-caret' />
                                                    <div className='header-current-text gr-6'>{it.L('Trading Window')}</div>
                                                    <div className='header-current-text gr-6'>{it.L('Remaining Time')}</div>
                                                </div>
                                            </div>
                                            <FormItem id='period' class_list='gr-12' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='price-table gr-row'>
                            <div id='disable-overlay' className='invisible' />
                            <div className='prices-wrapper gr-12'>
                                <div className='gr-row heading'>
                                    <div className='gr-4 barrier align-self-center'>{it.L('Barrier')}</div>
                                    <div className='gr-8' id='category'>
                                        <div className='current gr-12 gr-no-gutter-left' />
                                        <div className='list' />
                                    </div>
                                </div>
                                <div className='price-rows' />
                            </div>
                            <div id='loading-overlay' className='invisible'>
                                <Loading />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Analysis no_graph />

            <div id='open_positions_container'>
                <Portfolio />
            </div>

            <div id='templates' className='invisible'>
                <div className='gr-row price-row'>
                    <div className='gr-4 barrier' />
                    <div className='gr-4'>
                        <BuySellTemplate />
                    </div>
                    <div className='gr-4'>
                        <BuySellTemplate />
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default MBTrading;
