import React from 'react';
import { FilterDropdown } from '@deriv/components';
import { localize } from '@deriv/translations';
import CompositeCalendar from './Form/CompositeCalendar';
import { observer } from '@deriv/stores';
import { useReportsStore } from 'Stores/useReportsStores';

const FilterComponent = observer(() => {
    const { statement } = useReportsStore();
    const { action_type, date_from, date_to, handleFilterChange, handleDateChange, filtered_date_range } = statement;

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
        {
            text: localize('Transfer'),
            value: 'transfer',
        },
    ];

    return (
        <React.Fragment>
            <CompositeCalendar
                input_date_range={filtered_date_range}
                onChange={handleDateChange}
                from={date_from}
                to={date_to}
            />
            <FilterDropdown
                dropdown_display_className='dc-dropdown__display--has-suffix-icon'
                filter_list={filter_list}
                handleFilterChange={handleFilterChange}
                initial_selected_filter={action_type}
            />
        </React.Fragment>
    );
});

export default FilterComponent;
