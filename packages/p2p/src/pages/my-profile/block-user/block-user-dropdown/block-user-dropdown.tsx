import React from 'react';
import { DesktopWrapper, Dropdown, Icon, MobileWrapper } from '@deriv-app/components';
import { observer } from '@deriv-app/stores';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
// @ts-ignore
import { useStores } from 'Stores';

const BlockUserDropdown = () => {
    const { my_profile_store } = useStores();
    const { showModal } = useModalManagerContext();

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Dropdown
                    className='block-user-dropdown'
                    classNameLabel='block-user-dropdown--label'
                    is_align_text_left
                    list={my_profile_store.block_user_sort_list}
                    onChange={my_profile_store.handleChange}
                    placeholder={localize('Filter by')}
                    value={my_profile_store.selected_sort_value}
                />
            </DesktopWrapper>
            <MobileWrapper>
                <div
                    className='block-user-dropdown'
                    onClick={() => {
                        // @ts-ignore
                        showModal({ key: 'BlockUserFilterModal' });
                    }}
                >
                    <Icon icon='IcCashierSort' data_testid='dt_block_user_filter_icon' />
                </div>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(BlockUserDropdown);
