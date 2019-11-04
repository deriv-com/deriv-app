import React, { useEffect, useState, Fragment } from 'react';
import { Autocomplete, Loading } from 'deriv-components';
import { localize } from 'App/i18n';
import { connect } from 'Stores/connect';
import DataTable from 'App/Components/Elements/DataTable';
import { WS } from 'Services';
import { getBuySell } from '../constants/data-table-constants';

const currencies = {
    from: 'MYR',
    to  : 'BTC',
};

const data_offers = [
    {
        id                 : 1,
        advertisers        : 'John',
        available          : 'BTC 0.234',
        price              : 'MYR 34000',
        minimum_transaction: 'MYR 10',
    },
    {
        id                 : 2,
        advertisers        : 'Mcblurry',
        available          : 'BTC 0.234',
        price              : 'MYR 34000',
        minimum_transaction: 'MYR 10',
    },
    {
        id                 : 3,
        advertisers        : 'Saint MJ',
        available          : 'BTC 0.234',
        price              : 'MYR 34000',
        minimum_transaction: 'MYR 10',
    },
    {
        id                 : 4,
        advertisers        : 'Ki agus',
        available          : 'BTC 0.234',
        price              : 'MYR 34000',
        minimum_transaction: 'MYR 10',
    },
    {
        id                 : 5,
        advertisers        : 'Thompson',
        available          : 'BTC 0.234',
        price              : 'MYR 34000',
        minimum_transaction: 'MYR 10',
    },
];

const BuySell = () => {
    const [residence_list, setResidenceList] = useState([]);
    const [currency_list, setCurrencyList] = useState([]);
    const [is_loading, setLoading] = useState(true);

    const getResponse = async () => {
        const residence_response = await WS.residenceList();
        setResidenceList(residence_response.residence_list);

        const currency_response = await WS.websiteStatus();
        const response_currencies = currency_response.website_status.currencies_config;
        const filtered_currencies = Object.keys(response_currencies).map(currency => ({
            text : currency,
            value: currency,
        }));
        console.log(filtered_currencies)
        console.log('divider')
        // console.log(website_status);
        setCurrencyList(filtered_currencies);
        setLoading(false);
    };

    useEffect(() => {
        getResponse();
    }, []);

    if (is_loading) {
        return <Loading is_fullscreen={false} className='otc___intial-loader' />;
    }
    return (
        <Fragment>
            <div className='buy-sell__parameters'>
                <Autocomplete
                    data-lpignore='true'
                    className='buy-sell__parameters-dropdown'
                    autoComplete='new-password' // prevent chrome autocomplete
                    type='text'
                    label={localize('Country')}
                    list_items={residence_list}
                    onItemSelection={
                        ({ value, text }) => console.log(value, text)
                    }
                />
                <Autocomplete
                    data-lpignore='true'
                    className='buy-sell__parameters-dropdown'
                    autoComplete='new-password' // prevent chrome autocomplete
                    type='text'
                    label={localize('Currency')}
                    list_items={currency_list}
                    onItemSelection={
                        ({ value, text }) => console.log(value, text)
                    }
                />
            </div>
            <DataTable
                className='buy-sell'
                columns={getBuySell(currencies)}
                data_source={data_offers}
                custom_width={'100%'}
            />
        </Fragment>
    );
};
 
export default BuySell;
