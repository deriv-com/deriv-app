import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { localize } from 'Components/i18next';
import BlockUserModal from 'Components/block-user/block-user-modal';
import BlockUserList from './block-user-list';
import BlockUserFilterModal from './block-user-filter-modal';
import ErrorModal from 'Components/error-modal/error-modal';
import './block-user.scss';

const BlockUser = () => {
    const { general_store, my_profile_store } = useStores();

    return (
        <React.Fragment>
            <BlockUserModal
                advertiser_name={my_profile_store.selected_trade_partner.name}
                is_advertiser_blocked={!!my_profile_store.selected_trade_partner.is_blocked}
                is_block_user_modal_open={general_store.is_block_user_modal_open}
                onCancel={() => general_store.setIsBlockUserModalOpen(false)}
                onSubmit={my_profile_store.onSubmit}
            />
            <ErrorModal
                error_message={general_store.block_unblock_user_error}
                error_modal_title='Unable to block advertiser'
                has_close_icon={false}
                is_error_modal_open={general_store.block_unblock_user_error && !general_store.is_barred}
                setIsErrorModalOpen={() => general_store.setBlockUnblockUserError('')}
                width={isMobile() ? '90rem' : '40rem'}
            />
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
