import React from 'react';
import DataTable from 'App/Components/Elements/DataTable';
import { getBuySell } from '../constants/data-table-constants';

const currency = {
    from: 'MYR',
    to  : 'BTC',
};

const data_offers = [
    {
        id                 : 1,
        advertisers        : 'memek',
        available          : 'BTC 0.234',
        price              : 'MYR 34000',
        minimum_transaction: 'MYR 10',
    },
    {
        id                 : 2,
        advertisers        : 'memek',
        available          : 'BTC 0.234',
        price              : 'MYR 34000',
        minimum_transaction: 'MYR 10',
    },
    {
        id                 : 3,
        advertisers        : 'memek',
        available          : 'BTC 0.234',
        price              : 'MYR 34000',
        minimum_transaction: 'MYR 10',
    },
    {
        id                 : 4,
        advertisers        : 'memek',
        available          : 'BTC 0.234',
        price              : 'MYR 34000',
        minimum_transaction: 'MYR 10',
    },
    {
        id                 : 5,
        advertisers        : 'memek',
        available          : 'BTC 0.234',
        price              : 'MYR 34000',
        minimum_transaction: 'MYR 10',
    },
];

const BuySell = () => {
    return (
        <React.Fragment>
            <div className='buy-sell__parameters'>Hi buy sell parameters</div>
            <DataTable
                className='buy-sell-table'
                columns={getBuySell(currency)}
                data_source={data_offers}
                custom_width={'100%'}
            />
        </React.Fragment>
    );
};
 
export default BuySell;
