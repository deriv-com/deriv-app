import React             from 'react';
import {
    BoxRow,
    Box }                from '../../_common/components/box_row.jsx';
import { SeparatorLine } from '../../_common/components/separator_line.jsx';
import Step              from '../../_common/components/step.jsx';

const MAMBox = ({ image, ...props }) => (
    <Box img_src={it.url_for(`images/pages/mam/${image}.svg`)} {...props} />
);

const MAMStep = ({ image, ...props }) => (
    <Step img_src={it.url_for(`images/pages/mam/${image}.svg`)} {...props} />
);

const MultipleAccountsManager = () => (
    <React.Fragment>
        <div className='static_full'>
            <div className='container'>
                <h1>{it.L('Multiple Accounts Manager (MAM) for MetaTrader 5 (MT5)')}</h1>
                <p>{it.L('Assign and manage multiple sub-accounts seamlessly via one interface – the Multiple Accounts Manager (MAM).')}</p>
                <p>{it.L('The MAM tool is ideal for money managers who want to easily manage multiple client accounts. It gives you the ability to simultaneously view, track, and trade on behalf of all MT5 client accounts under your control.')}</p>
                <p>{it.L('Best of all, your commissions are credited into your account instantly.')}</p>
            </div>
        </div>

        <div className='gr-padding-30'>
            <div className='fill-bg-color box-inlay-borders'>
                <div className='gr-padding-30 center-text container'>
                    <h2>{it.L('Key features')}</h2>

                    <SeparatorLine invisible className='gr-parent gr-padding-20' />

                    <BoxRow top_row>
                        <MAMBox
                            image='deposit'
                            text={it.L('Client\'s deposits or withdrawals are immediately reflected in the corresponding master account balance in real time')}
                        />
                        <MAMBox
                            image='methods'
                            text={it.L('Use a variety of allocation methods (e.g equity, balance, even, and lot) to distribute trade volumes, starting from 0.01 lots')}
                        />
                        <MAMBox
                            image='tools'
                            text={it.L('Access all available tools and features for trading on MT5, including Expert Advisors (EAs), charts, and order types')}
                        />
                    </BoxRow>

                    <BoxRow bottom_row>
                        <MAMBox
                            image='info'
                            text={it.L('View essential information for open positions associated with each login ID – including order type (buy/sell), open time, open price,  stop loss, take profit, swap, and profit')}
                        />
                        <MAMBox
                            image='exclude'
                            text={it.L('Use two different exclusion types: \'Allocation\' excludes a client from future trades only, while \'Full\' also closes open positions and removes its balance from the master account. Clients can choose to close any open position.')}
                        />
                        <MAMBox
                            image='manage'
                            text={it.L('View all the information you need to manage your client list – including login ID, group, leverage, balance, equity, and margin')}
                        />
                    </BoxRow>
                </div>
            </div>
        </div>

        <div className='container'>
            <h2 className='center-text'>{it.L('How it works')}</h2>

            <SeparatorLine invisible show_mobile className='gr-parent gr-padding-30' />

            <div className='steps'>
                <MAMStep
                    image='talktous'
                    header={it.L('Talk to us')}
                    text={it.L('Interested in our MAM tool? [_1]Contact us[_2] for more information on setting up your master account', '<a href="mailto:marketing@binary.com">', '</a>')}
                    circle_no='1'
                />
                <MAMStep
                    image='download'
                    header={it.L('Download MAM')}
                    text={it.L('[_1]Download MAM for Windows[_2] after you\'ve set up your master account. Your login credentials will be provided', '<a href="https://s3.amazonaws.com/binary-mt5/binarycom_mam.rar" rel="noopener noreferrer">', '</a>')}
                    circle_no='2'
                />
                <MAMStep
                    image='monitor'
                    header={it.L('Manage sub accounts')}
                    text={it.L('Monitor and manage your client list, adjust settings for individual sub accounts, and more')}
                    circle_no='3'
                />
            </div>

            <div className='center-text'>
                <p>{it.L('Interested in our MAM tool for MetaTrader 5? Contact us at [_1] for more info.', '<a href="mailto:marketing@binary.com">marketing@binary.com</a>')}</p>
            </div>
        </div>
    </React.Fragment>

);

export default MultipleAccountsManager;
