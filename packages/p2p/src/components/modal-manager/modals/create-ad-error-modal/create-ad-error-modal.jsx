import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { api_error_codes } from 'Constants/api-error-codes';
import { useStores } from 'Stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const CreateAdErrorModal = () => {
    const { my_ads_store } = useStores();
    const { hideModal, is_modal_open } = useModalManagerContext();

    if (my_ads_store.error_code === api_error_codes.DUPLICATE_ADVERT) {
        return (
            <Modal
                className='p2p-my-ads__modal-error'
                is_open={is_modal_open}
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
                    <Button has_effect text={localize('Update ad')} onClick={() => hideModal()} primary large />
                </Modal.Footer>
            </Modal>
        );
    } else if (my_ads_store.error_code === api_error_codes.ADVERT_SAME_LIMITS) {
        return (
            <Modal
                className='p2p-my-ads__modal-error'
                is_open={is_modal_open}
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
                    <Button has_effect text={localize('Update ad')} onClick={() => hideModal()} primary large />
                </Modal.Footer>
            </Modal>
        );
    }
    return (
        <Modal
            className='p2p-my-ads__modal-error'
            is_open={is_modal_open}
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
                <Button has_effect text={localize('Ok')} onClick={() => hideModal()} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(CreateAdErrorModal);
