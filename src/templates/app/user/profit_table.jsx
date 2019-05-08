import React from 'react';
import { DatePicker } from '../../_common/components/elements.jsx';
import Loading from '../../_common/components/loading.jsx';

const ProfitTable = () => (
    <React.Fragment>
        <div id='profit-table-container'>
            <div className='page-title' id='profit-table-title'>
                <h1>{it.L('Profit Table')}</h1>
                <p className='notice-msg center-text invisible' id='error-msg' />
            </div>
            <div id='util_row' className='gr-padding-10 container gr-row gr-row-align-right gr-row-align-left-m invisible'>
                <DatePicker id='date_to' text={it.L('Show all historical transactions up to')} />
            </div>
            <Loading />
        </div>
    </React.Fragment>
);

export default ProfitTable;
