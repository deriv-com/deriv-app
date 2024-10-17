import React from 'react';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import { removeTrailingZeros, roundOffDecimal, setDecimalPlaces } from 'Utils/format-value';
import { getIconSize, getTextSize } from 'Utils/responsive';

const EmailLinkVerifiedModal = () => {
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { isMobile } = useDevice();
    const { order_store } = useStores();
    const { advertiser_details, amount_display, is_buy_order_for_user, local_currency, rate } =
        order_store.order_information || {};
    const amount = removeTrailingZeros(
        formatMoney(local_currency, amount_display * Number(roundOffDecimal(rate, setDecimalPlaces(rate, 6))), true)
    );

    return (
        <React.Fragment>
            {order_store.order_information && (
                <Modal
                    is_open={is_modal_open}
                    renderTitle={() => <></>}
                    toggleModal={() => {
                        order_store.setVerificationCode('');
                        order_store.setActionParam(null);
                        hideModal();
                    }}
                    width='440px'
                >
                    <Modal.Body className='email-link-verified-modal'>
                        <Icon icon='IcEmailVerificationLinkValid' size={getIconSize(96, 128, isMobile)} />
                        <Text
                            align='center'
                            className='email-link-verified-modal__text'
                            color='prominent'
                            size={getTextSize('xs', 's', isMobile)}
                            weight='bold'
                        >
                            <Localize i18n_default_text='One last step before we close this order' />
                        </Text>
                        <Text align='center' color='prominent' size={getTextSize('xs', 's', isMobile)}>
                            <Localize
                                i18n_default_text='If you’ve received {{amount}} {{local_currency}} from {{name}} in your bank account or e-wallet, hit the button below to complete the order.'
                                values={{ amount, local_currency, name: advertiser_details?.name }}
                            />
                        </Text>
                    </Modal.Body>
                    <Modal.Footer className='email-link-verified-modal__footer'>
                        <Button
                            medium
                            primary
                            onClick={() => {
                                hideModal({ should_hide_all_modals: true });
                                order_store.confirmOrder(is_buy_order_for_user);
                                order_store.setVerificationCode('');
                                order_store.setActionParam(null);
                            }}
                        >
                            <Localize i18n_default_text='Confirm' />
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </React.Fragment>
    );
};

export default EmailLinkVerifiedModal;
