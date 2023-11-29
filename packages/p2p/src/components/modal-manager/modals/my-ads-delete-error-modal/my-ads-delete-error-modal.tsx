import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';

const MyAdsDeleteErrorModal = () => {
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { my_ads_store } = useStores();
    const { delete_error_message } = my_ads_store;

    return (
        <Modal
            className='delete-modal'
            has_close_icon={false}
            is_open={is_modal_open}
            renderTitle={() => (
                <Text color='prominent' size={isMobile() ? 'xs' : 's'} weight='bold'>
                    <Localize i18n_default_text='Do you want to delete this ad?' />
                </Text>
            )}
            width='440px'
        >
            <Modal.Body>{delete_error_message}</Modal.Body>
            <Modal.Footer>
                <Button.Group>
                    <Button primary large onClick={() => hideModal()}>
                        <Localize i18n_default_text='Ok' />
                    </Button>
                </Button.Group>
            </Modal.Footer>
        </Modal>
    );
};

export default observer(MyAdsDeleteErrorModal);
