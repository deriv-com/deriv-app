import React from 'react';
import { WalletButton, WalletsActionScreen, WalletText } from '../../../../../components';
import EmailVerification from '../../../../../public/images/email-verification.svg';
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
                        <WalletText align='center'>
                            Hit the button below, and we&apos;ll email you a verification link.
                        </WalletText>
                        <WalletText align='center'>
                            This is to confirm that it&apos;s you making the withdrawal request.
                        </WalletText>
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
                    <WalletButton onClick={sendEmail} size='lg'>
                        Send email
                    </WalletButton>
                )}
                title='Confirm your identity to make a withdrawal.'
            />
        </div>
    );
};

export default WithdrawalVerificationRequest;
