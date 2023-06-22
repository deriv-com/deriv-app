import React from 'react';
import { reaction } from 'mobx';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { useStores } from 'Stores';
import { api_error_codes } from 'Constants/api-error-codes';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import BlockUserList from './block-user-list';

const BlockUser = () => {
    const { buy_sell_store, general_store, my_profile_store } = useStores();
    const { hideModal, showModal, useRegisterModalProps } = useModalManagerContext();

    const { is_blocked, name } = my_profile_store.selected_trade_partner;
    const { block_unblock_user_error, error_code } = general_store;

    const error_message = () => {
        return is_blocked
            ? localize("Unblocking wasn't possible as {{name}} is not using Deriv P2P anymore.", {
                  name,
              })
            : localize("Blocking wasn't possible as {{name}} is not using Deriv P2P anymore.", {
                  name,
              });
    };

    reaction(
        () => block_unblock_user_error,
        () => {
            if (
                block_unblock_user_error &&
                general_store.active_index === 3 &&
                !buy_sell_store.show_advertiser_page &&
                error_code !== api_error_codes.TEMPORARY_BAR &&
                error_code !== api_error_codes.PERMISSION_DENIED
            ) {
                showModal({
                    key: 'ErrorModal',
                    props: {
                        error_message:
                            error_code === api_error_codes.INVALID_ADVERTISER_ID
                                ? error_message()
                                : block_unblock_user_error,
                        error_modal_button_text: localize('Got it'),
                        error_modal_title:
                            error_code === api_error_codes.INVALID_ADVERTISER_ID
                                ? localize('{{name}} is no longer on Deriv P2P', {
                                      name,
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
