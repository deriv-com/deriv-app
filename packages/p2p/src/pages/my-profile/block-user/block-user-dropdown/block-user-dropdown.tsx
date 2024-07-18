import React from 'react';
import { Dropdown, Icon } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';

const BlockUserDropdown = () => {
    const { isDesktop } = useDevice();
    const { my_profile_store } = useStores();
    const { showModal } = useModalManagerContext();

    if (isDesktop) {
        return (
            <Dropdown
                className='block-user-dropdown'
                classNameLabel='block-user-dropdown--label'
                is_align_text_left
                list={my_profile_store.block_user_sort_list}
                onChange={my_profile_store.handleChange}
                placeholder={localize('Filter by')}
                value={my_profile_store.selected_sort_value}
            />
        );
    }

    return (
        <div
            className='block-user-dropdown'
            onClick={() => {
                showModal({ key: 'BlockUserFilterModal' });
            }}
        >
            <Icon icon='IcCashierSort' data_testid='dt_block_user_filter_icon' />
        </div>
    );
};

export default observer(BlockUserDropdown);
