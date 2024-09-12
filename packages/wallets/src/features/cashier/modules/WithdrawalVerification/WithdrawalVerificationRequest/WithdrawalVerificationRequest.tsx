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
                        <Localize i18n_default_text='Send email' />
                    </Button>
                }
                description={
                    <div className='wallets-withdrawal-verification-request__description'>
                        <Text align='center'>
                            <Localize i18n_default_text="Press the button below, and we'll email you a verification link." />
                        </Text>
                        <Text align='center'>
                            <Localize i18n_default_text="This is to confirm that it's you making the withdrawal request." />
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
                title={<Localize i18n_default_text='Confirm your identity to make a withdrawal.' />}
            />
        </div>
    );
};

export default WithdrawalVerificationRequest;
