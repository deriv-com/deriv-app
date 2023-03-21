import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper } from '@deriv/components';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import BlockUserList from './block-user-list';
import BlockUserFilterModal from './block-user-filter-modal';
import './block-user.scss';

const BlockUser = () => {
    const { my_profile_store } = useStores();
    const { hideModal, useRegisterModalProps } = useModalManagerContext();

    useRegisterModalProps({
        key: 'BlockUserModal',
        props: {
            advertiser_name: my_profile_store.selected_trade_partner.name,
            is_advertiser_blocked: !!my_profile_store.selected_trade_partner.is_blocked,
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
                <BlockUserFilterModal />
                <MobileFullPageModal
                    body_className='block-user__modal'
                    height_offset='80px'
                    is_flex
                    is_modal_open
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
