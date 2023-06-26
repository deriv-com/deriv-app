import React from 'react';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useStores } from 'Stores';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import BlockUserList from './block-user-list';

const BlockUser = () => {
    const { my_profile_store } = useStores();
    const { hideModal, useRegisterModalProps } = useModalManagerContext();

    const { is_blocked, name } = my_profile_store.selected_trade_partner;

    useRegisterModalProps({
        key: 'BlockUserModal',
        props: {
            advertiser_name: name,
            is_advertiser_blocked: !!is_blocked,
            onCancel: hideModal,
            onSubmit: my_profile_store.onSubmit,
        },
    });

    return (
        <React.Fragment>
            <DesktopWrapper>
                <BlockUserList />
            </DesktopWrapper>
            <MobileWrapper>
                <MobileFullPageModal
                    body_className='block-user__modal'
                    height_offset='80px'
                    is_flex
                    is_modal_open={my_profile_store.active_tab === my_profile_tabs.MY_COUNTERPARTIES}
                    page_header_className='buy-sell__modal-header'
                    page_header_text={localize('My counterparties')}
                    pageHeaderReturnFn={() => my_profile_store.setActiveTab(my_profile_tabs.MY_STATS)}
                >
                    <BlockUserList />
                </MobileFullPageModal>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(BlockUser);
