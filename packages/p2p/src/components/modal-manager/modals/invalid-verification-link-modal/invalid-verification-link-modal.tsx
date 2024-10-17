import React from 'react';
import classNames from 'classnames';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { api_error_codes } from 'Constants/api-error-codes';

type TInvalidVerificationLinkModalProps = {
    error_message: string;
    order_id: string;
};

const InvalidVerificationLinkModal = ({ error_message, order_id }: TInvalidVerificationLinkModalProps) => {
    const { order_store } = useStores();
    const { isDesktop } = useDevice();
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { confirmOrderRequest, error_code, setIsVerifyingEmail } = order_store;
    const is_invalid_verification_token = error_code === api_error_codes.INVALID_VERIFICATION_TOKEN;

    return (
        <Modal
            is_open={is_modal_open}
            renderTitle={() => <></>}
            toggleModal={() => {
                hideModal();
                setIsVerifyingEmail(false);
            }}
            width='440px'
        >
            <Modal.Body className='invalid-verification-link-modal'>
                <Icon icon='IcEmailVerificationLinkInvalid' size={!isDesktop ? '96' : '128'} />
                {is_invalid_verification_token && (
                    <Text color='prominent' weight='bold'>
                        <Localize i18n_default_text='Invalid verification link' />
                    </Text>
                )}
                <Text
                    align='center'
                    size={!isDesktop ? 'xs' : 's'}
                    weight={is_invalid_verification_token ? 'normal' : 'bold'}
                >
                    {error_message}
                </Text>
            </Modal.Body>
            <Modal.Footer
                className={classNames('invalid-verification-link-modal__footer', {
                    'invalid-verification-link-modal__footer--invalid-token': is_invalid_verification_token,
                })}
            >
                <Button
                    large
                    primary
                    onClick={() => {
                        hideModal();
                        setIsVerifyingEmail(false);
                        if (is_invalid_verification_token) confirmOrderRequest(order_id);
                    }}
                >
                    {is_invalid_verification_token ? (
                        <Localize i18n_default_text='Get new link' />
                    ) : (
                        <Localize i18n_default_text='OK' />
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default InvalidVerificationLinkModal;
