import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import { generateErrorDialogBody, generateErrorDialogTitle } from 'Utils/adverts';

const CreateAdErrorModal = () => {
    const { my_ads_store } = useStores();
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { api_error_message, error_code } = my_ads_store;

    return (
        <Modal
            className='create-ad-error-modal'
            is_open={is_modal_open}
            small
            has_close_icon={false}
            title={generateErrorDialogTitle(error_code)}
        >
            <Modal.Body>
                <Text as='p' color='prominent' size='xs'>
                    {generateErrorDialogBody(error_code, api_error_message)}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    has_effect
                    text={error_code ? localize('Update ad') : localize('Ok')}
                    onClick={hideModal}
                    primary
                    large
                />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(CreateAdErrorModal);
