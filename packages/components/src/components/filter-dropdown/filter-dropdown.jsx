import * as React from 'react';
import PropTypes from 'prop-types';
import { isMobile } from '@deriv/shared';
import Dropdown from '../dropdown/dropdown';
import SelectNative from '../select-native/select-native';

const FilterDropdown = ({
    dropdown_className,
    dropdown_display_className,
    filter_list,
    handleFilterChange,
    initial_selected_filter,
}) => {
    const [selected_filter, setSelectedFilter] = React.useState(initial_selected_filter ?? filter_list?.[0]?.value);

    const onChange = event => {
        setSelectedFilter(event.target.value);

        if (typeof handleFilterChange === 'function') {
            handleFilterChange(event.target.value);
        }
    };

    if (isMobile()) {
        return (
            <SelectNative
                list_items={filter_list}
                value={selected_filter}
                hide_selected_value
                suffix_icon='IcFilter'
                should_show_empty_option={false}
                onChange={onChange}
            />
        );
    }

    return (
        <Dropdown
            list={filter_list}
            value={selected_filter}
            name='dc-filter-dropdown'
            className={dropdown_className}
            classNameDisplay={dropdown_display_className}
            suffix_icon='IcFilter'
            onChange={onChange}
        />
    );
};

FilterDropdown.propTypes = {
    dropdown_className: PropTypes.string,
    dropdown_display_className: PropTypes.string,
    filter_list: PropTypes.array.isRequired,
    handleFilterChange: PropTypes.func,
    initial_filter: PropTypes.string,
    initial_selected_filter: PropTypes.string,
};

export default FilterDropdown;
