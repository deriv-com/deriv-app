import React from 'react';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { setDecimalPlaces, removeTrailingZeros, roundOffDecimal } from 'Utils/format-value';

const EmailLinkVerifiedModal = () => {
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { order_store } = useStores();
    const { amount_display, is_buy_order_for_user, local_currency, rate } = order_store.order_information;
    const amount = removeTrailingZeros(
        formatMoney(local_currency, amount_display * roundOffDecimal(rate, setDecimalPlaces(rate, 6)), true)
    );

    return (
        <Modal has_close_icon is_open={is_modal_open} renderTitle={() => <></>} toggleModal={hideModal} width='440px'>
            <Modal.Body className='email-verified-modal'>
                <Icon icon='IcEmailVerificationLinkValid' size='128' />
                <Text className='email-verified-modal--text' color='prominent' size='s' weight='bold'>
                    <Localize i18n_default_text="We've verified your order" />
                </Text>
                <Text align='center' color='prominent' size='s'>
                    <Localize
                        i18n_default_text="Please ensure you've received {{amount}} {{local_currency}} in your account and hit Confirm to complete the transaction."
                        values={{ amount, local_currency }}
                    />
                </Text>
            </Modal.Body>
            <Modal.Footer className='email-verified-modal--footer'>
                <Button
                    large
                    primary
                    onClick={() => {
                        hideModal();
                        order_store.confirmOrder(is_buy_order_for_user);
                    }}
                >
                    <Localize i18n_default_text='Confirm' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EmailLinkVerifiedModal;
