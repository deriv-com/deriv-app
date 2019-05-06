import React from 'react';
import { Table } from '../../_common/components/elements.jsx';

const Portfolio = () => (
    <div id='portfolio'>
        <h1 className='portfolio-header-margin'>{it.L('Portfolio')}</h1>

        <p className='notice-msg center-text invisible' id='error-msg' />

        <div id='portfolio-loading' />

        <div id='portfolio-content' className='invisible'>
            <div className='gr-parent gr-padding-10'>
                {it.L('Account balance: ')}
                <span className='loading' id='portfolio-balance' />

                {/* If the account balance is zero we show the following button, otherwise we remove it */}
                <span id='if-balance-zero' className='invisible'>
                    &nbsp;
                    <a href={it.url_for('cashier/forwardws?action=deposit')} className='button nowrap'>
                        <span>{it.L('Make a Deposit')}</span>
                    </a>
                </span>
            </div>

            <div id='portfolio-no-contract'>
                <p>{it.L('No open positions.')}</p>
            </div>

            <Table
                id='portfolio-table'
                tbody_id='portfolio-body'
                scroll
                data={{
                    thead: [
                        [
                            { className: 'ref',                              text: it.L('Ref.') },
                            { className: 'payout nowrap',                    text: it.L('Potential Payout') },
                            { className: 'details',                          text: it.L('Contract Details') },
                            { className: 'purchase',                         text: it.L('Purchase') },
                            { className: 'indicative nowrap',                text: it.L('Indicative') },
                            { className: 'button',                           text: '' },
                        ],
                    ],
                    tfoot: [
                        [
                            { text: it.L('Total') },
                            { className: 'ref',                   attributes: { colSpan: 2 } },
                            { className: 'cost',                  id: 'cost-of-open-positions' },
                            { className: 'value',                 id: 'value-of-open-positions', attributes: { colSpan: 2 } },
                        ],
                    ],
                }}
            />
        </div>
    </div>
);

export default Portfolio;
