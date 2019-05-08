import React from 'react';
import Wrapper from './wrapper.jsx';
import { Table } from '../../../_common/components/elements.jsx';

const RcRow = ({ string, id }) => (
    <div className='gr-row gr-padding-10'>
        <div className='gr-3 gr-6-m'><label>{string}</label></div>
        <div className='gr-9 gr-6-m'><label id={id} /></div>
    </div>
);

const Summary = () => (
    <React.Fragment>
        <Wrapper>
            <RcRow string={it.L('Login time:')} id='login_time' />
            <RcRow string={it.L('Current time:')} id='current_time' />
            <RcRow string={it.L('Session duration:')} id='session_duration' />

            <p id='start_time' />

            <div className='table-container'>
                <Table
                    data={{
                        tbody: [
                            [
                                { header: it.L('Login ID') },
                                { header: it.L('Currency') },
                                { header: it.L('Turnover') },
                                { header: it.L('Profit / Loss') },
                                { header: it.L('Contracts bought') },
                                { header: it.L('Contracts sold') },
                                { header: it.L('Open contracts') },
                                { header: it.L('Potential profit') },
                            ],
                            [
                                { id: 'loginid' },
                                { id: 'rc_currency' },
                                { id: 'turnover' },
                                { id: 'profit_loss' },
                                { id: 'bought' },
                                { id: 'sold' },
                                { id: 'open' },
                                { id: 'potential' },
                            ],
                        ],
                    }}
                />
            </div>
        </Wrapper>
    </React.Fragment>
);

export default Summary;
