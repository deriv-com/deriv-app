import React, { useState } from 'react';
import {
    DerivLightIcEmailSentIcon,
    DerivLightIcFirewallEmailPasskeyIcon,
    DerivLightIcSpamEmailPasskeyIcon,
    DerivLightIcTypoEmailPasskeyIcon,
    DerivLightIcWrongEmailPasskeyIcon,
} from '@deriv/quill-icons';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './EmailVerificationModal.scss';

const reasons = [
    {
        icon: DerivLightIcSpamEmailPasskeyIcon,
        text: 'The email is in your spam folder (sometimes things get lost there).',
    },
    {
        icon: DerivLightIcWrongEmailPasskeyIcon,
        text: 'You accidentally gave us another email address (usually a work or a personal one instead of the one you meant).',
    },
    {
        icon: DerivLightIcTypoEmailPasskeyIcon,
        text: 'The email address you entered had a mistake or typo (happens to the best of us).',
    },
    {
        icon: DerivLightIcFirewallEmailPasskeyIcon,
        text: 'We can’t deliver the email to this address (usually because of firewalls or filtering).',
    },
];

type TEmailVerificationModalProps = {
    isModalOpen: boolean;
    onRequestClose: () => void;
};

const EmailVerificationModal = ({ isModalOpen, onRequestClose }: TEmailVerificationModalProps) => {
    const [shouldShowReasons, setShouldShowReasons] = useState<boolean>(false);
    const { isMobile } = useDevice();
    const emailIconSize = isMobile ? 100 : 128;
    const reasonIconSize = isMobile ? 32 : 36;

    return (
        <Modal
            ariaHideApp={false}
            className='p2p-v2-email-verification-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
        >
            <Modal.Header className='mt-2' hideBorder onRequestClose={onRequestClose} />
            <Modal.Body className='flex flex-col items-center justify-center lg:gap-[2.4rem] gap-8 lg:px-10 lg:pb-10 p-8 pt-0'>
                <DerivLightIcEmailSentIcon height={emailIconSize} width={emailIconSize} />
                <Text align='center' weight='bold'>
                    Has the buyer paid you?
                </Text>
                <Text align='center' size={isMobile ? 'sm' : 'md'}>
                    Releasing funds before receiving payment may result in losses. Check your email and follow the
                    instructions <strong>within 10 minutes</strong> to release the funds.
                </Text>
                <Button
                    className='p2p-v2-email-verification-modal__button'
                    onClick={() => setShouldShowReasons(true)}
                    variant='ghost'
                >
                    I didn’t receive the email
                </Button>
                {shouldShowReasons && (
                    <div className='flex flex-col w-full gap-8'>
                        {reasons.map(reason => (
                            <div className='grid grid-cols-[11%_89%] gap-4 items-center' key={reason.text}>
                                <reason.icon height={reasonIconSize} width={reasonIconSize} />
                                <Text size='xs'>{reason.text}</Text>
                            </div>
                        ))}
                        <div className='flex justify-center'>
                            {/* TODO: Replace 59s with epoch value (verification_next_request) from BE response
                             * and disable the button if the epoch value is not reached yet
                             */}
                            <Button size='md'>Resend email 59s</Button>
                        </div>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default EmailVerificationModal;
