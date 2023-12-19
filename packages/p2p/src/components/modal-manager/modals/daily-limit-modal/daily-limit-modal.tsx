import React from 'react';
import classNames from 'classnames';
import { Button, Loading, Modal, Text } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';

const DailyLimitModal = () => {
    const { my_profile_store, general_store } = useStores();
    const { daily_buy_limit, daily_sell_limit } = general_store.advertiser_info;
    const {
        client: { currency },
    } = useStore();
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { is_daily_limit_upgrade_success, is_daily_limit_upgrading, is_there_daily_limit_error } = my_profile_store;

    const getModalHeaderTitle = () => {
        if (is_daily_limit_upgrading) {
            return null;
        } else if (is_daily_limit_upgrade_success) {
            return (
                <Text color='prominent' weight='bold'>
                    <Localize i18n_default_text='Success!' />
                </Text>
            );
        } else if (is_there_daily_limit_error) {
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
        if (is_daily_limit_upgrading) {
            return <Loading className='daily-limit-modal__loader' is_fullscreen={false} />;
        } else if (is_daily_limit_upgrade_success) {
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
        } else if (is_there_daily_limit_error) {
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
        if (is_daily_limit_upgrading) {
            return null;
        } else if (is_daily_limit_upgrade_success || is_there_daily_limit_error) {
            return (
                <Button has_effect onClick={hideModal} primary large>
                    <Localize i18n_default_text='Ok' />
                </Button>
            );
        }

        return (
            <>
                <Button has_effect onClick={hideModal} secondary large>
                    <Localize i18n_default_text='No' />
                </Button>
                <Button
                    has_effect
                    onClick={() => {
                        my_profile_store.setIsDailyLimitUpgrading(true);
                        my_profile_store.upgradeDailyLimit();
                    }}
                    primary
                    large
                >
                    <Localize i18n_default_text='Yes, continue' />
                </Button>
            </>
        );
    };

    return (
        <Modal is_open={is_modal_open} small has_close_icon={false} title={getModalHeaderTitle()} width='440px'>
            <Modal.Body
                className={classNames('daily-limit-modal__body', {
                    'daily-limit-modal__upgrading': is_daily_limit_upgrading,
                })}
            >
                {getModalContent()}
            </Modal.Body>
            <Modal.Footer>{getModalFooter()}</Modal.Footer>
        </Modal>
    );
};

export default observer(DailyLimitModal);
