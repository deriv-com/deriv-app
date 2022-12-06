import React from 'react';
import { Dropdown } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './block-user-dropdown.scss';

const BlockUserDropdown = () => {
    const { my_profile_store } = useStores();

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
