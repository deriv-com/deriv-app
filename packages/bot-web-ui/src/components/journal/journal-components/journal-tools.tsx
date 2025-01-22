import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import Download from 'Components/download';
import { TJournalToolsProps } from '../journal.types';
import FilterDialog from './filter-dialog';

const JournalTools = ({
    checked_filters,
    filters,
    filterMessage,
    is_filter_dialog_visible,
    toggleFilterDialog,
}: TJournalToolsProps) => {
    const toggle_ref = React.useRef<HTMLDivElement>(null);

    return (
        <>
            <div className='journal-tools__container'>
                <Download tab='journal' />
                <div ref={toggle_ref} className='journal-tools__container-filter' onClick={toggleFilterDialog}>
                    <Text size='xs' className='journal-tools__container-filter--label'>
                        <Localize i18n_default_text='Filters' />
                    </Text>
                    <Icon icon='IcFilter' size={16} />
                </div>
            </div>
            <FilterDialog
                toggle_ref={toggle_ref}
                checked_filters={checked_filters}
                filters={filters}
                filterMessage={filterMessage}
                is_filter_dialog_visible={is_filter_dialog_visible}
                toggleFilterDialog={toggleFilterDialog}
            />
        </>
    );
};

export default JournalTools;
