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
        <div className='buy-sell'>
            <div className='buy-sell__parameters'>Hi buy sell parameters</div>
            <div className='buy-sell__datatable'>
                <DataTable
                    className='buy-sell__offers'
                    columns={getBuySell(currency)}
                    data_source={data_offers}
                    custom_width={'100%'}
                />
            </div>
        </div>
    );
};
 
export default BuySell;
