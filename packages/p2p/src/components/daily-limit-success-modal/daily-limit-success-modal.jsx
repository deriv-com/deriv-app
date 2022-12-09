import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Modal, Text } from '@deriv/components';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';

const DailyLimitSuccessModal = () => {
    const { my_profile_store } = useStores();

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
                        i18n_default_text='Your daily limits have been increased to {{daily_buy_limit}} USD (buy) and {{daily_sell_limit}} USD (sell).'
                        values={{ daily_buy_limit: '10,000', daily_sell_limit: '10,000' }}
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
