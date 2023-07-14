import React from 'react';
import classNames from 'classnames';
import { reaction } from 'mobx';
import { useHistory } from 'react-router-dom';
import { Loading } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { api_error_codes } from 'Constants/api-error-codes';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';
import AdvertiserPageAdverts from './advertiser-page-adverts';
import AdvertiserPageHeader from './advertiser-page-header';
import AdvertiserPageProfile from './advertiser-page-profile';
import BlockUserOverlay from './block-user/block-user-overlay';

const AdvertiserPage = () => {
    const { advertiser_page_store, buy_sell_store, general_store, my_profile_store } = useStores();
    const { hideModal, showModal, useRegisterModalProps } = useModalManagerContext();

    const is_my_advert = advertiser_page_store.advertiser_details_id === general_store.advertiser_id;
    // Use general_store.advertiser_info since resubscribing to the same id from advertiser page returns error
    const info = is_my_advert ? general_store.advertiser_info : advertiser_page_store.counterparty_advertiser_info;

    const history = useHistory();

    const { name } = info;

    const nickname = advertiser_page_store.advertiser_details_name ?? name;

    const error_message = () => {
        return !!advertiser_page_store.is_counterparty_advertiser_blocked && !is_my_advert
            ? localize("Unblocking wasn't possible as {{name}} is not using Deriv P2P anymore.", {
                  name: nickname,
              })
            : localize("Blocking wasn't possible as {{name}} is not using Deriv P2P anymore.", {
                  name: nickname,
              });
    };

    const handleOpenModal = () => {
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
                              name: nickname,
                          })
                        : localize('Unable to block advertiser'),
                has_close_icon: false,
                onClose: () => {
                    buy_sell_store.hideAdvertiserPage();
                    history.push(general_store.active_tab_route);
                    if (general_store.active_index !== 0)
                        my_profile_store.setActiveTab(my_profile_tabs.MY_COUNTERPARTIES);
                    advertiser_page_store.onCancel();
                    general_store.setBlockUnblockUserError('');
                    hideModal();
                },
                width: isMobile() ? '90rem' : '40rem',
            },
        });
        general_store.setBlockUnblockUserError(null);
    };

    React.useEffect(() => {
        advertiser_page_store.onMount();
        advertiser_page_store.setIsDropdownMenuVisible(false);
        const disposeCounterpartyAdvertiserIdReaction = reaction(
            () => [general_store.counterparty_advertiser_id, general_store.is_advertiser_info_subscribed],
            () => {
                // DO NOT REMOVE. This fixes reload on advertiser page routing issue
                advertiser_page_store.onAdvertiserIdUpdate();
            },
            { fireImmediately: true }
        );

        reaction(
            () => [advertiser_page_store.active_index, general_store.block_unblock_user_error],
            () => {
                advertiser_page_store.onTabChange();
                if (general_store.block_unblock_user_error && buy_sell_store.show_advertiser_page) {
                    handleOpenModal();
                }
            },
            { fireImmediately: true }
        );

        return () => {
            disposeCounterpartyAdvertiserIdReaction();
            advertiser_page_store.onUnmount();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useRegisterModalProps({
        key: 'BlockUserModal',
        props: {
            advertiser_name: name,
            is_advertiser_blocked: !!advertiser_page_store.is_counterparty_advertiser_blocked && !is_my_advert,
            onCancel: advertiser_page_store.onCancel,
            onSubmit: advertiser_page_store.onSubmit,
        },
    });

    if (advertiser_page_store.is_loading || general_store.is_block_unblock_user_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (advertiser_page_store.error_message) {
        return <div className='advertiser-page__error'>{advertiser_page_store.error_message}</div>;
    }

    const onClickBack = () => {
        buy_sell_store.hideAdvertiserPage();
        if (general_store.active_index === general_store.path.my_profile)
            my_profile_store.setActiveTab(my_profile_tabs.MY_COUNTERPARTIES);
    };

    return (
        <div
            className={classNames('advertiser-page', {
                'advertiser-page--no-scroll':
                    !!advertiser_page_store.is_counterparty_advertiser_blocked && !is_my_advert,
            })}
        >
            <AdvertiserPageHeader
                title={localize("Advertiser's page")}
                onClickPageReturn={onClickBack}
                is_my_advert={is_my_advert}
            />
            <BlockUserOverlay
                is_visible={!!advertiser_page_store.is_counterparty_advertiser_blocked && !is_my_advert}
                onClickUnblock={() =>
                    showModal({
                        key: 'BlockUserModal',
                    })
                }
            >
                <AdvertiserPageProfile />
                <AdvertiserPageAdverts />
            </BlockUserOverlay>
        </div>
    );
};

export default observer(AdvertiserPage);
