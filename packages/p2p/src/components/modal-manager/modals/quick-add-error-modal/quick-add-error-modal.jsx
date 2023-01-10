import React from 'react';
import { observer } from 'mobx-react-lite';
import { generateErrorDialogTitle } from 'Utils/adverts';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { Button, Modal, Text } from '@deriv/components';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';

const QuickAddErrorModal = () => {
    const { my_ads_store } = useStores();
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal
            className='p2p-my-ads__modal-error'
            has_close_icon={false}
            is_open={is_modal_open}
            small
            title={generateErrorDialogTitle(my_ads_store.error_code)}
        >
            <Modal.Body>
                <Text as='p' size='xs' color='prominent'>
                    {my_ads_store.update_payment_methods_error_message}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect large onClick={hideModal} primary text={localize('Ok')} />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(QuickAddErrorModal);
