import React from 'react';
import { Dropdown, Icon } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './block-user-dropdown.scss';

const BlockUserDropdown = () => {
    const { my_profile_store } = useStores();

    if (isMobile()) {
        return (
            <div
                className='block-user-dropdown'
                onClick={() => {
                    my_profile_store.setIsFilterModalOpen(true);
                }}
            >
                <Icon icon='IcCashierSort' />
            </div>
        );
    }

    return (
        <Dropdown
            className='block-user-dropdown'
            classNameLabel='block-user-dropdown--label'
            is_align_text_left
            list={my_profile_store.block_user_sort_list}
            onChange={my_profile_store.handleChange}
            placeholder={localize('Sort by')}
            value={my_profile_store.selected_sort_value}
        />
    );
};

export default observer(BlockUserDropdown);
