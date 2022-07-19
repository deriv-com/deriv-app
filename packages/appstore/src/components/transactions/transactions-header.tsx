import * as React from 'react';
import { Text, FilterDropdown } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { TTransactionActionType } from './transactions.types';

type TFilterListItem = {
    text: string;
    value: TTransactionActionType;
};

type TProps = {
    selected_filter: TTransactionActionType;
    onFilterChange: (value: TTransactionActionType) => void;
};

const TransactionsHeader: React.FC<TProps> = ({ selected_filter, onFilterChange }) => {
    const filter_list: TFilterListItem[] = [
        {
            text: localize('All'),
            value: 'all',
        },
        {
            text: localize('Deposit'),
            value: 'deposit',
        },
        {
            text: localize('Withdrawal'),
            value: 'withdrawal',
        },
        // TODO: Enable below when API is updated.
        // {
        //     text: localize('Transfer'),
        //     value: 'transfer',
        // },
    ];

    return (
        <div className='dw-transactions__header'>
            <div className='dw-transactions__header-container'>
                <Text as='p' color='prominent' size='s' line_height='m' weight='bold'>
                    <Localize i18n_default_text='Transactions' />
                </Text>
            </div>
            <div className='dw-transactions__header-container'>
                <FilterDropdown
                    dropdown_className='dw-transactions__filter-dropdown'
                    filter_list={filter_list}
                    handleFilterChange={onFilterChange}
                    initial_selected_filter={selected_filter}
                />
            </div>
        </div>
    );
};

export default TransactionsHeader;
