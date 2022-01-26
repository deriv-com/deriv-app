import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';

const CreateAdErrorModal = () => {
    const { my_ads_store } = useStores();

    if (my_ads_store.create_ad_error_code === 'DuplicateAdvert') {
        return (
            <Modal
                className='p2p-my-ads__modal-error'
                is_open={my_ads_store.is_api_error_modal_visible}
                small
                has_close_icon={false}
                title={localize('You already have an ad with this rate')}
            >
                <Modal.Body>
                    <Text as='p' color='prominent' size='xs'>
                        <Localize i18n_default_text='You already have an ad with the same exchange rate for this currency pair and order type. <br/><br/>Please set a different rate for your ad.' />
                    </Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        has_effect
                        text={localize('Update ad')}
                        onClick={() => my_ads_store.setIsApiErrorModalVisible(false)}
                        primary
                        large
                    />
                </Modal.Footer>
            </Modal>
        );
    } else if (my_ads_store.create_ad_error_code === 'AdvertSameLimits') {
        return (
            <Modal
                className='p2p-my-ads__modal-error'
                is_open={my_ads_store.is_api_error_modal_visible}
                small
                has_close_icon={false}
                title={localize('You already have an ad with this range')}
            >
                <Modal.Body>
                    <Text as='p' color='prominent' size='xs'>
                        <Localize i18n_default_text='Please set a different minimum and/or maximum order limit. <br/><br/>The range of your ad should not overlap with any of your active ads.' />
                    </Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        has_effect
                        text={localize('Update ad')}
                        onClick={() => my_ads_store.setIsApiErrorModalVisible(false)}
                        primary
                        large
                    />
                </Modal.Footer>
            </Modal>
        );
    }
    return (
        <Modal
            className='p2p-my-ads__modal-error'
            is_open={my_ads_store.is_api_error_modal_visible}
            small
            has_close_icon={false}
            title={localize("Something's not right")}
        >
            <Modal.Body>
                <Text as='p' color='prominent' size='xs'>
                    {my_ads_store.api_error_message}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    has_effect
                    text={localize('Ok')}
                    onClick={() => my_ads_store.setIsApiErrorModalVisible(false)}
                    primary
                    large
                />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(CreateAdErrorModal);
