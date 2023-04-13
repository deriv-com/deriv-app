import React from 'react';
import { Button, Loading, Modal, Text } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { observer, useStore } from '@deriv/stores';

const DailyLimitModal = () => {
    const { my_profile_store, general_store } = useStores();
    const { daily_buy_limit, daily_sell_limit } = general_store.advertiser_info;
    const {
        client: { currency },
    } = useStore();

    const getModalHeaderTitle = () => {
        if (my_profile_store.is_loading_modal_open) {
            return null;
        } else if (my_profile_store.is_daily_limit_success_modal_open) {
            return (
                <Text color='prominent' weight='bold'>
                    <Localize i18n_default_text='Success!' />
                </Text>
            );
        } else if (my_profile_store.is_error_modal_open) {
            return (
                <Text color='prominent' weight='bold'>
                    <Localize i18n_default_text='An internal error occurred' />
                </Text>
            );
        }

        return (
            <Text color='prominent' weight='bold'>
                <Localize i18n_default_text='Are you sure?' />
            </Text>
        );
    };

    const getModalContent = () => {
        if (my_profile_store.is_loading_modal_open) {
            return <Loading className='daily-limit-modal__loader' is_fullscreen={false} />;
        } else if (my_profile_store.is_daily_limit_success_modal_open) {
            return (
                <Text as='p' size='xs' color='prominent'>
                    <Localize
                        i18n_default_text='Your daily limits have been increased to {{daily_buy_limit}} {{currency}} (buy) and {{daily_sell_limit}} {{currency}} (sell).'
                        values={{
                            daily_buy_limit: formatMoney(currency, daily_buy_limit, true),
                            currency,
                            daily_sell_limit: formatMoney(currency, daily_sell_limit, true),
                        }}
                    />
                </Text>
            );
        } else if (my_profile_store.is_error_modal_open) {
            return (
                <Text as='p' size='xs' color='prominent'>
                    <Localize i18n_default_text="Sorry, we're unable to increase your limits right now. Please try again in a few minutes." />
                </Text>
            );
        }

        return (
            <Text as='p' size='xs' color='prominent'>
                <Localize i18n_default_text="You won't be able to change your buy and sell limits again after this. Do you want to continue?" />
            </Text>
        );
    };

    const getModalFooter = () => {
        if (my_profile_store.is_loading_modal_open) {
            return null;
        } else if (my_profile_store.is_daily_limit_success_modal_open || my_profile_store.is_error_modal_open) {
            return (
                <Button
                    has_effect
                    text={localize('Ok')}
                    onClick={() => {
                        my_profile_store.setIsDailyLimitModalOpen(false);
                    }}
                    primary
                    large
                />
            );
        }

        return (
            <>
                <Button
                    has_effect
                    text={localize('No')}
                    onClick={() => my_profile_store.setIsDailyLimitModalOpen(false)}
                    secondary
                    large
                />
                <Button
                    has_effect
                    text={localize('Yes, continue')}
                    onClick={() => {
                        my_profile_store.setIsLoadingModalOpen(true);
                        my_profile_store.upgradeDailyLimit();
                    }}
                    primary
                    large
                />
            </>
        );
    };

    return (
        <Modal
            is_open={my_profile_store.is_daily_limit_modal_open}
            small
            has_close_icon={false}
            title={getModalHeaderTitle()}
            width='440px'
        >
            <Modal.Body>{getModalContent()}</Modal.Body>
            <Modal.Footer>{getModalFooter()}</Modal.Footer>
        </Modal>
    );
};

export default observer(DailyLimitModal);
