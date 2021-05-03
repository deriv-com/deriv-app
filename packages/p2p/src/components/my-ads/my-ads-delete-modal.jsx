import PropTypes from 'prop-types';
import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { isDesktop, useIsMounted } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { Localize } from 'Components/i18next';
import { requestWS } from 'Utils/websocket';
import FormError from 'Components/form/error.jsx';
import { useStores } from 'Stores';
import 'Components/my-ads/my-ads-delete-modal.scss';

const MyAdsDeleteModal = () => {
    const { my_ads_store } = useStores();
    const isMounted = useIsMounted();
    const [error_message, setErrorMessage] = React.useState('');

    const onClickCancel = () => {
        setErrorMessage('');
        my_ads_store.setSelectedAdId('');
        my_ads_store.setIsDeleteModalOpen(false);
    };

    const onClickConfirm = () => {
        requestWS({ p2p_advert_update: 1, id: my_ads_store.selected_ad_id, delete: 1 }).then(response => {
            if (isMounted()) {
                if (response.error) {
                    setErrorMessage(response.error.message);
                } else {
                    // remove the deleted ad from the list of items
                    const updated_items = my_ads_store.adverts.filter(ad => ad.id !== response.p2p_advert_update.id);
                    my_ads_store.setAdverts(updated_items);
                    my_ads_store.setIsDeleteModalOpen(false);
                }
            }
        });
    };

    return (
        <Modal
            className='delete-modal'
            is_open={my_ads_store.is_delete_modal_open}
            toggleModal={onClickCancel}
            has_close_icon
            renderTitle={() => (
                <Text color='prominent' line-height='m' size={isDesktop() ? 's' : 'xs'} weight='bold'>
                    <Localize i18n_default_text='Do you want to delete this ad?' />
                </Text>
            )}
            width='440px'
        >
            <Modal.Body>
                <Localize i18n_default_text='You will NOT be able to restore it.' />
            </Modal.Body>
            <Modal.Footer>
                {error_message && <FormError message={error_message} />}
                <Button.Group>
                    <Button secondary type='button' onClick={onClickCancel} large>
                        <Localize i18n_default_text='Cancel' />
                    </Button>
                    <Button primary large onClick={onClickConfirm}>
                        <Localize i18n_default_text='Delete' />
                    </Button>
                </Button.Group>
            </Modal.Footer>
        </Modal>
    );
};

MyAdsDeleteModal.propTypes = {
    is_delete_modal_open: PropTypes.bool,
    setIsDeleteModalOpen: PropTypes.func,
};

export default observer(MyAdsDeleteModal);
