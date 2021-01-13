import React from 'react';
import { Dropdown } from '@deriv/components';
import { localize } from '@deriv/translations';
import CompositeCalendar from 'App/Components/Form/CompositeCalendar/composite-calendar.jsx';

const TransactionFilter = ({ handleFilterChange }) => {
    const [default_filter, setDefaultFilter] = React.useState('all');

    const filter_list = [
        {
            text: localize('All transactions'),
            value: 'all',
        },
        {
            text: localize('Buy'),
            value: 'buy',
        },
        {
            text: localize('Sell'),
            value: 'sell',
        },
        {
            text: localize('Deposit'),
            value: 'deposit',
        },
        {
            text: localize('Withdrawal'),
            value: 'withdrawal',
        },
    ];

    return (
        <Dropdown
            list={filter_list}
            value={default_filter}
            name='transaction-filter-dropdown'
            className='dropdown-statement-filter'
            classNameDisplay='dc-dropdown__display--suffix-icon'
            has_symbol={false}
            suffix_icon={'IcFilter'}
            onChange={e => {
                setDefaultFilter(e.target.value);
                handleFilterChange(e.target.value);
            }}
        />
    );
};

const FilterComponent = (filtered_date_range, handleDateChange, date_from, date_to, handleFilterChange) => (
    <React.Fragment>
        <CompositeCalendar
            input_date_range={filtered_date_range}
            onChange={handleDateChange}
            from={date_from}
            to={date_to}
        />
        <TransactionFilter handleFilterChange={handleFilterChange} />
    </React.Fragment>
);

export default FilterComponent;
