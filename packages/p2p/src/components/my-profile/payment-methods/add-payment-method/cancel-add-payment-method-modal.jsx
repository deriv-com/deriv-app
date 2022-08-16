import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';
import { isMobile } from '@deriv/shared';
import PropTypes from 'prop-types';

const CancelAddPaymentMethodModal = ({
    closeAllModalsOnCancel = false,
    onCancel,
    onGoBack,
    onCancelAddPaymentMethodForm,
}) => {
    const { my_profile_store } = useStores();

    const transitionModal = handler => {
        if (isMobile()) {
            handler?.();
        } else {
            setTimeout(handler, my_profile_store.MODAL_TRANSITION_DURATION);
        }
    };

    React.useEffect(() => {
        my_profile_store.setOnCancelAddPaymentMethodFormHandler(onCancelAddPaymentMethodForm);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Modal
            has_close_icon={false}
            is_open={my_profile_store.is_cancel_add_payment_method_modal_open}
            small
            title={
                <Text color='prominent' size='s' weight='bold'>
                    <Localize i18n_default_text='Cancel adding this payment method?' />
                </Text>
            }
        >
            <Modal.Body>
                <Text color='prominent' size='xs'>
                    <Localize i18n_default_text='If you choose to cancel, the details you’ve entered will be lost.' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    large
                    onClick={() => {
                        transitionModal(onCancel);
                        my_profile_store.setShouldShowAddPaymentMethodForm(false);
                        my_profile_store.hideCancelAddPaymentMethodModal(closeAllModalsOnCancel);
                        my_profile_store.clearFormState();
                    }}
                    secondary
                >
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button
                    large
                    onClick={() => {
                        transitionModal(onGoBack);
                        my_profile_store.setShouldShowAddPaymentMethodForm(true);
                        my_profile_store.hideCancelAddPaymentMethodModal();
                    }}
                    primary
                >
                    <Localize i18n_default_text='Go back' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

CancelAddPaymentMethodModal.propTypes = {
    closeAllModalsOnCancel: PropTypes.bool,
    onCancel: PropTypes.func,
    onCancelAddPaymentMethodForm: PropTypes.func.isRequired,
    onGoBack: PropTypes.func,
};

export default observer(CancelAddPaymentMethodModal);
