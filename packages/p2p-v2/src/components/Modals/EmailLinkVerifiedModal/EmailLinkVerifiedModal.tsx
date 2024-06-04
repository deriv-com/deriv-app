import React from 'react';
import { DerivLightIcEmailVerificationLinkValidIcon } from '@deriv/quill-icons';
import { Button, Modal, Text } from '@deriv-com/ui';
import './EmailLinkVerifiedModal.scss';

type TEmailLinkVerifiedModal = {
    isModalOpen: boolean;
    onRequestClose: () => void;
};

// TODO: replace value, currency and username with actual values when implementing function
const EmailLinkVerifiedModal = ({ isModalOpen, onRequestClose }: TEmailLinkVerifiedModal) => {
    return (
        <Modal ariaHideApp={false} className='p2p-v2-email-link-verified-modal' isOpen={isModalOpen}>
            <Modal.Header hideBorder onRequestClose={onRequestClose} />
            <Modal.Body className='flex flex-col items-center gap-[2.4rem] px-[2.4rem] pt-[2.4rem]'>
                <DerivLightIcEmailVerificationLinkValidIcon height={128} width={128} />
                <Text align='center' weight='bold'>
                    One last step before we close this order
                </Text>
                <Text align='center'>
                    If you’ve received 100 USD from Test in your bank account or e-wallet, hit the button below to
                    complete the order.
                </Text>
            </Modal.Body>
            <Modal.Footer className='justify-center mt-4' hideBorder>
                <Button
                    onClick={() => {
                        // add function here when implementing this modal
                    }}
                    size='md'
                >
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EmailLinkVerifiedModal;
