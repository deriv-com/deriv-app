import * as React from 'react';
import { isMobile } from '@deriv/shared';
import Dropdown from '../dropdown/dropdown.jsx';
import SelectNative from '../select-native/select-native.jsx';

type FilterDropdownProps = {
    dropdown_className: string;
    dropdown_display_className: string;
    filter_list: unknown;
    handleFilterChange: () => void;
    initial_filter: string;
};

const FilterDropdown = ({
    dropdown_className,
    dropdown_display_className,
    filter_list,
    handleFilterChange,
    initial_selected_filter,
}: FilterDropdownProps) => {
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

export default FilterDropdown;
