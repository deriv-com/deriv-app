import React from 'react';
import { isMobile } from '@deriv/shared';
import Dropdown from '../dropdown/dropdown';
import SelectNative from '../select-native/select-native';

type TListItem = {
    text: string;
    value: string;
    disabled?: boolean;
    nativepicker_text?: React.ReactNode;
    group?: string;
    id?: string;
};

type TFilterDropdown = {
    dropdown_className: string;
    dropdown_display_className: string;
    filter_list: Array<TListItem>;
    handleFilterChange: (e: string) => void;
    initial_filter: string;
    initial_selected_filter: string;
    label: string;
    hide_top_placeholder: boolean;
};

const FilterDropdown = ({
    dropdown_className,
    dropdown_display_className,
    filter_list,
    handleFilterChange,
    initial_selected_filter,
    label,
    hide_top_placeholder,
}: TFilterDropdown) => {
    const [selected_filter, setSelectedFilter] = React.useState(initial_selected_filter ?? filter_list?.[0]?.value);

    const onChange = (event: { target: { name: string; value: string } }) => {
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
                label={label}
                hide_top_placeholder={hide_top_placeholder}
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
