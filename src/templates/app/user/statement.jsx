import React from 'react';
import { Button, DatePicker } from '../../_common/components/elements.jsx';
import Loading from '../../_common/components/loading.jsx';

const AccountStatisticsBox = ({ id, title, heading, className }) => (
    <div className={`gr-3 gr-12-m ${className || ''}`}>
        { title ?
            <p className='title'>{title}</p>
            :
            <span className='hint'>{heading}</span>
        }
        { id && <p id={id} /> }
    </div>
);

const Statement = () => (
    <React.Fragment>
        <div id='statement-container'>
            <div className='page-title' id='statement-title'>
                <h1>{it.L('Statement')}</h1>
                <p className='notice-msg center-text invisible' id='error-msg' />
            </div>
            <div id='account_statistics' className='gr-row invisible'>
                <AccountStatisticsBox title={it.L('Account statistics')} className='fill-bg-color' />
                <AccountStatisticsBox id='total_deposits'    heading={it.L('Total deposits')} />
                <AccountStatisticsBox id='total_withdrawals' heading={it.L('Total withdrawals')} />
                <AccountStatisticsBox id='net_deposits'      heading={it.L('Net deposits')} />
            </div>

            <div id='util_row' className='gr-row gr-padding-10 gr-parent invisible container'>
                <div className='gr-12 gr-12-m'>
                    <div className='gr-row gr-row-align-right gr-row-align-left-m gr-row-align-middle'>
                        <DatePicker id='date_to' text={it.L('Show all historical transactions up to')} />
                        <Button id='download_statement_btn' className='button-secondary invisible' text={it.L('Download your statement')} />
                    </div>
                </div>
                <div className='gr-12 gr-12-m align-end'>
                    <div id='download_csv' className='invisible'>{it.L('[_1] rows displayed:', '<span id=\'rows_count\'></span>')} <a href='javascript:;'>{it.L('Download CSV')}</a></div>
                </div>
            </div>
            <Loading />
        </div>

        <div id='download-statement-container' className='invisible'>
            <div className='page-title'>
                <h1>{it.L('Download your statement')}</h1>
            </div>
            <p>{it.L('Please select the date range of your statement:')}</p>
            <div className='gr-row gr-row-align-center-m'>
                <DatePicker className='gr-4 gr-5-t gr-5-p gr-12-m gr-padding-10' id='download_from' text={it.L('From')} />
                <DatePicker className='gr-4 gr-5-t gr-5-p gr-12-m gr-padding-10' id='download_to'   text={it.L('To')} />
                <div className='gr-12 gr-padding-30'>
                    <div className='gr-row gr-row-align-center-m container'>
                        <Button id='request_statement_btn' className='button button-disabled no-margin' text={it.L('Request your statement')} />
                        <Button id='go_back_btn' href='javascript:;' className='gr-gutter-right gr-gutter-left'>
                            <div className='gr-row gr-padding-10 container'>
                                <span className='gr-hide gr-show-m'>{('<<')}&nbsp;</span>{it.L('Back to statement')}
                            </div>
                        </Button>
                    </div>
                    <p className='success-msg invisible'>{it.L('Your statement has been sent to your email address.')}</p>
                    <p className='error-msg invisible' />
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default Statement;
