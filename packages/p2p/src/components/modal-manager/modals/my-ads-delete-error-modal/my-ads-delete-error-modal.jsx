import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const MyAdsDeleteErrorModal = () => {
    const { my_ads_store } = useStores();
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <React.Fragment>
            <Modal
                className='delete-modal'
                has_close_icon={false}
                is_open={is_modal_open}
                renderTitle={() => (
                    <Text color='prominent' line-height='m' size={isDesktop() ? 's' : 'xs'} weight='bold'>
                        <Localize i18n_default_text='Do you want to delete this ad?' />
                    </Text>
                )}
                width='440px'
            >
                <Modal.Body>{my_ads_store.delete_error_message}</Modal.Body>
                <Modal.Footer>
                    <Button.Group>
                        <Button primary large onClick={() => hideModal()}>
                            <Localize i18n_default_text='Ok' />
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default observer(MyAdsDeleteErrorModal);
