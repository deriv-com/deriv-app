import React from 'react';
import { DerivLightEmailVerificationIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { ActionScreen, Button, Text } from '@deriv-com/ui';
import './WithdrawalVerificationRequest.scss';

type TProps = {
    sendEmail: () => void;
};

const WithdrawalVerificationRequest: React.FC<TProps> = ({ sendEmail }) => {
    return (
        <div className='wallets-withdrawal-verification-request'>
            <ActionScreen
                actionButtons={
                    <Button onClick={sendEmail} size='lg' textSize='md'>
                        <Localize i18n_default_text='Send link' />
                    </Button>
                }
                description={
                    <div className='wallets-withdrawal-verification-request__description'>
                        <Text align='center'>
                            <Localize i18n_default_text="To continue withdrawal, verify it's you. We will send a verification link to your email." />
                        </Text>
                    </div>
                }
                icon={
                    <div
                        className='wallets-withdrawal-verification-request__icon'
                        data-testid='dt_withdrawal_verification_request_icon'
                    >
                        <DerivLightEmailVerificationIcon height={102} width={102} />
                    </div>
                }
                title={<Localize i18n_default_text='Verification needed' />}
            />
        </div>
    );
};

export default WithdrawalVerificationRequest;
