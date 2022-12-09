import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Modal, Text } from '@deriv/components';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';

const DailyLimitModal = () => {
    const { my_profile_store } = useStores();

    return (
        <Modal
            is_open={my_profile_store.is_daily_limit_modal_open}
            small
            has_close_icon={false}
            title={
                <Text color='prominent' weight='bold'>
                    <Localize i18n_default_text='Are you sure?' />
                </Text>
            }
        >
            <Modal.Body>
                <Text as='p' size='xs' color='prominent'>
                    <Localize i18n_default_text="You won't be able to change your buy and sell limits again after this. Do you want to continue?" />
                </Text>
            </Modal.Body>
            <Modal.Footer>
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
                        my_profile_store.setIsDailyLimitModalOpen(false);
                        my_profile_store.upgradeDailyLimit();
                    }}
                    primary
                    large
                />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(DailyLimitModal);
