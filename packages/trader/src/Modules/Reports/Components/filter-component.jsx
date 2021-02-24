import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DesktopWrapper, MobileWrapper, SelectNative } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import CompositeCalendar from 'App/Components/Form/CompositeCalendar/composite-calendar.jsx';

const TransactionFilter = ({ action_type, handleFilterChange }) => {
    const [default_filter, setDefaultFilter] = React.useState(action_type);

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
            <DesktopWrapper>
                <Dropdown
                    list={filter_list}
                    value={default_filter}
                    name='transaction-filter-dropdown'
                    className='dropdown-statement-filter'
                    classNameDisplay='dc-dropdown__display--has-suffix-icon'
                    has_symbol={false}
                    suffix_icon={'IcFilter'}
                    onChange={e => {
                        setDefaultFilter(e.target.value);
                        handleFilterChange(e.target.value);
                    }}
                />
            </DesktopWrapper>
            <MobileWrapper>
                <SelectNative
                    list_items={filter_list}
                    value={default_filter}
                    hide_selected_value={true}
                    suffix_icon={'IcFilter'}
                    should_show_empty_option={false}
                    onChange={e => {
                        setDefaultFilter(e.target.value);
                        handleFilterChange(e.target.value);
                    }}
                />
            </MobileWrapper>
        </React.Fragment>
    );
};

const FilterComponent = ({
    action_type,
    date_from,
    date_to,
    handleFilterChange,
    handleDateChange,
    filtered_date_range,
}) => {
    return (
        <React.Fragment>
            <CompositeCalendar
                input_date_range={filtered_date_range}
                onChange={handleDateChange}
                from={date_from}
                to={date_to}
            />
            <TransactionFilter action_type={action_type} handleFilterChange={handleFilterChange} />
        </React.Fragment>
    );
};

FilterComponent.propTypes = {
    action_type: PropTypes.string,
    date_from: PropTypes.number,
    date_to: PropTypes.number,
    filtered_date_range: PropTypes.object,
    handleDateChange: PropTypes.func,
    handleFilterChange: PropTypes.func,
    suffix_icon: PropTypes.string,
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
