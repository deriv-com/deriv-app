import React from 'react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { api_error_codes } from 'Constants/api-error-codes';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import BlockUserList from './block-user-list';
import BlockUserFilterModal from './block-user-filter-modal';
import './block-user.scss';

const BlockUser = () => {
    const { general_store, buy_sell_store, my_profile_store } = useStores();
    const { hideModal, showModal, useRegisterModalProps } = useModalManagerContext();
    const error_message = () => {
        return my_profile_store.selected_trade_partner.is_blocked
            ? localize("Unblocking wasn't possible as {{name}} is not using Deriv P2P anymore.", {
                  name: my_profile_store.selected_trade_partner.name,
              })
            : localize("Blocking wasn't possible as {{name}} is not using Deriv P2P anymore.", {
                  name: my_profile_store.selected_trade_partner.name,
              });
    };

    reaction(
        () => general_store.block_unblock_user_error,
        () => {
            if (
                general_store.block_unblock_user_error &&
                general_store.active_index === 3 &&
                !buy_sell_store.show_advertiser_page &&
                general_store?.error_code !== api_error_codes.TEMPORARY_BAR &&
                general_store?.error_code !== api_error_codes.PERMISSION_DENIED
            ) {
                showModal({
                    key: 'ErrorModal',
                    props: {
                        error_message:
                            general_store.error_code === api_error_codes.INVALID_ADVERTISER_ID
                                ? error_message()
                                : general_store.block_unblock_user_error,
                        error_modal_button_text: localize('Got it'),
                        error_modal_title:
                            general_store.error_code === api_error_codes.INVALID_ADVERTISER_ID
                                ? localize('{{name}} is no longer on Deriv P2P', {
                                      name: my_profile_store.selected_trade_partner.name,
                                  })
                                : localize('Unable to block advertiser'),

                        has_close_icon: false,
                        onClose: () => {
                            general_store.setBlockUnblockUserError('');
                            hideModal();
                        },
                        width: isMobile() ? '90rem' : '40rem',
                    },
                });
                general_store.setBlockUnblockUserError(null);
            }
        },
        { fireImmediately: true }
    );

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
