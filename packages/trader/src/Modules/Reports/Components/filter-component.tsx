import React from 'react';
import { FilterDropdown } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import CompositeCalendar from 'App/Components/Form/CompositeCalendar/composite-calendar.jsx';

type FilterComponentProps = {
    action_type: string;
    date_from: number;
    date_to: number;
    filtered_date_range: unknown;
    handleDateChange: () => void;
    handleFilterChange: () => void;
    suffix_icon: string;
};

const FilterComponent = ({
    action_type,
    date_from,
    date_to,
    handleFilterChange,
    handleDateChange,
    filtered_date_range,
}: FilterComponentProps) => {
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
};

export default connect(({ modules }) => ({
    action_type: modules.statement.action_type,
    data: modules.statement.data,
    date_from: modules.statement.date_from,
    date_to: modules.statement.date_to,
    filtered_date_range: modules.statement.filtered_date_range,
    handleDateChange: modules.statement.handleDateChange,
    handleFilterChange: modules.statement.handleFilterChange,
}))(FilterComponent);
