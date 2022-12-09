import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Modal, Text } from '@deriv/components';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';

const DailyLimitSuccessModal = () => {
    const { general_store, my_profile_store } = useStores();
    const { daily_buy_limit, daily_sell_limit } = general_store.advertiser_info;
    const { currency } = general_store.client;

    return (
        <Modal
            is_open={my_profile_store.is_daily_limit_success_modal_open}
            small
            has_close_icon={false}
            title={
                <Text color='prominent' weight='bold'>
                    <Localize i18n_default_text='Success!' />
                </Text>
            }
        >
            <Modal.Body>
                <Text as='p' size='xs' color='prominent'>
                    <Localize
                        i18n_default_text='Your daily limits have been increased to {{daily_buy_limit}} {{currency}} (buy) and {{daily_sell_limit}} {{currency}} (sell).'
                        values={{ daily_buy_limit, currency, daily_sell_limit }}
                    />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    has_effect
                    text={localize('Ok')}
                    onClick={() => my_profile_store.setIsDailyLimitSuccessModalOpen(false)}
                    primary
                    large
                />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(DailyLimitSuccessModal);
