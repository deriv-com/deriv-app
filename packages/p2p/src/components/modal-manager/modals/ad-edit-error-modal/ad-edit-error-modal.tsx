import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { api_error_codes } from 'Constants/api-error-codes';
import { useStores } from 'Stores';
import { generateErrorDialogBody, generateErrorDialogTitle } from 'Utils/adverts';

const AdEditErrorModal = () => {
    const { my_ads_store } = useStores();
    const { edit_ad_form_error, error_code } = my_ads_store;
    const { hideModal, is_modal_open } = useModalManagerContext();

    const is_api_error = [api_error_codes.ADVERT_SAME_LIMITS, api_error_codes.DUPLICATE_ADVERT].includes(error_code);

    const button_text = is_api_error ? localize('Update ad') : localize('Ok');
    return (
        <Modal is_open={is_modal_open} small has_close_icon={false} title={generateErrorDialogTitle(error_code)}>
            <Modal.Body>
                <Text as='p' size='xs' color='prominent'>
                    {generateErrorDialogBody(error_code, edit_ad_form_error)}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect onClick={hideModal} primary large>
                    <Localize i18n_default_text={button_text} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default observer(AdEditErrorModal);
