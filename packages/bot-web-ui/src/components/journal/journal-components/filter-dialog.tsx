import React from 'react';
import { useOnClickOutside } from '@deriv/components';
import { TFilterDialogProps } from '../journal.types';
import { Filters } from '.';

const FilterDialog = ({
    toggle_ref,
    checked_filters,
    filters,
    filterMessage,
    is_filter_dialog_visible,
    toggleFilterDialog,
}: TFilterDialogProps) => {
    const wrapper_ref = React.useRef<HTMLDivElement>(null);
    const validateClickOutside = (event: React.ChangeEvent<HTMLInputElement>) =>
        is_filter_dialog_visible && !toggle_ref.current?.contains(event.target);

    useOnClickOutside(wrapper_ref, toggleFilterDialog, validateClickOutside);

    return (
        <Filters
            wrapper_ref={wrapper_ref}
            checked_filters={checked_filters}
            filters={filters}
            filterMessage={filterMessage}
            className='filter-dialog'
        />
    );
};

export default FilterDialog;
