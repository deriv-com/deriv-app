import React from 'react';
import { Button, Text } from '@deriv-com/ui';
import EmailVerification from '../../../assets/images/email-verification.svg';
import { WalletsActionScreen } from '../../../components/WalletsActionScreen';
import './WithdrawalVerificationRequest.scss';

type TProps = {
    sendEmail: () => void;
};

const WithdrawalVerificationRequest: React.FC<TProps> = ({ sendEmail }) => {
    return (
        <div className='wallets-withdrawal-verification-request'>
            <WalletsActionScreen
                description={
                    <div className='wallets-withdrawal-verification-request__description'>
                        <Text align='center'>
                            Click the button below and we&apos;ll send you an email with a link. Click that link to
                            verify your withdrawal request.
                        </Text>
                        <Text align='center'>This is to protect your account from unauthorised withdrawals.</Text>
                    </div>
                }
                icon={
                    <div
                        className='wallets-withdrawal-verification-request__icon'
                        data-testid='dt_withdrawal_verification_request_icon'
                    >
                        <EmailVerification />
                    </div>
                }
                renderButtons={() => (
                    <Button onClick={sendEmail} size='lg'>
                        Send email
                    </Button>
                )}
                title='Please help us verify your withdrawal request.'
            />
        </div>
    );
};

export default WithdrawalVerificationRequest;
