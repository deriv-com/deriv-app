import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
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

const FilterComponent = props => {
    return (
        <React.Fragment>
            <CompositeCalendar
                input_date_range={props.filtered_date_range}
                onChange={props.handleDateChange}
                from={props.date_from}
                to={props.date_to}
            />
            <TransactionFilter handleFilterChange={props.handleFilterChange} />
        </React.Fragment>
    );
};

FilterComponent.propTypes = {
    date_from: PropTypes.number,
    date_to: PropTypes.number,
    filtered_date_range: PropTypes.object,
    handleDateChange: PropTypes.func,
    handleFilterChange: PropTypes.func,
};

export default connect(({ modules }) => ({
    data: modules.statement.data,
    date_from: modules.statement.date_from,
    date_to: modules.statement.date_to,
    filtered_date_range: modules.statement.filtered_date_range,
    handleDateChange: modules.statement.handleDateChange,
    handleFilterChange: modules.statement.handleFilterChange,
}))(FilterComponent);
