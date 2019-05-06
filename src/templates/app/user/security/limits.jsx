import React from 'react';
import { Table } from '../../../_common/components/elements.jsx';

const Limits = () => {
    const data_balloon = `<a href="javascript:;" data-balloon-length="xlarge" class='no-underline' data-balloon="%"><img src="${it.url_for('images/common/question_1.png')}"></a>`;
    const balloonReplace = (txt, balloon_txt) =>
        it.dangreouslyRenderHtml(it.L(txt) + data_balloon.replace('%', it.L(balloon_txt)));

    const open_position = balloonReplace(
        'Maximum number of open positions',
        'Represents the maximum number of outstanding contracts in your portfolio. Each line in your portfolio counts for one open position. Once the maximum is reached, you will not be able to open new positions without closing an existing position first.'
    );
    const account_balance = balloonReplace(
        'Maximum account cash balance',
        'Represents the maximum amount of cash that you may hold in your account.  If the maximum is reached, you will be asked to withdraw funds.'
    );
    const payout = balloonReplace(
        'Maximum aggregate payouts on open positions',
        'Presents the maximum aggregate payouts on outstanding contracts in your portfolio. If the maximum is attained, you may not purchase additional contracts without first closing out existing positions.'
    );
    const limit = balloonReplace(
        'Maximum daily turnover',
        'Represents the maximum volume of contracts that you may purchase in any given trading day.'
    );

    return (
        <React.Fragment>
            <div id='limits-container' className='gr-12 gr-padding-10'>
                <h1>{it.L('Trading and Withdrawal Limits')}</h1>
                <div className='invisible' id='limits-title'>
                    <h2 id='trading-limits'>{it.L('Trading Limits')}</h2>
                    <div className='gr-padding-10'>
                        <Table
                            id='client-limits'
                            data={{
                                thead: [[{ text: it.L('Item'), className: 'align-start' }, { text: it.L('Limit'), className: 'limit align-start' }]],
                                tbody: [
                                    [
                                        { text: open_position },
                                        { text: '', id: 'open-positions' },
                                    ],
                                    [
                                        { text: account_balance },
                                        { text: '', id: 'account-balance' },
                                    ],
                                    [
                                        { text: payout },
                                        { text: '', id: 'payout' },
                                    ],
                                    [
                                        { className: 'gr-padding-10', id: 'gap' },
                                        { text: '' },
                                    ],
                                    [
                                        { header: limit, className: 'align-start', id: 'market_specific' },
                                        { header: it.L('Limit'), className: 'limit align-start' },
                                    ],
                                ],
                            }}
                        />
                        <p className='hint'>
                            {it.L('Stated limits are subject to change without prior notice.')}
                        </p>
                    </div>
                </div>
                <div id='limits_error' />
            </div>
            <div className='invisible' id='withdrawal-limits'>
                <h2 id='withdrawal-title'>{it.L('Withdrawal Limits')}</h2>
                <div>
                    <p id='withdrawal-limit' />
                    <p id='already-withdraw' />
                    <p id='withdrawal-limit-aggregate' />
                    <p id='already-withdraw-aggregate' />
                </div>
            </div>
        </React.Fragment>
    );
};

export default Limits;
