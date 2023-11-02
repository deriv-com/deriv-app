import React from 'react';
import EmailVerification from '../../../../../public/images/email-verification.svg';
import WalletsActionScreen from '../../../../../components/WalletsActionScreen/WalletsActionScreen';
import { WalletText } from '../../../../../components';
import './WithdrawalVerificationRequest.scss';

type TProps = {
    sendEmail: () => void;
};

const WithdrawalVerificationRequest: React.FC<TProps> = ({ sendEmail }) => {
    return (
        <div className='wallets-withdrawal-verification-request'>
            <WalletsActionScreen
                actionText='Send email'
                description={
                    <div className='wallets-withdrawal-verification-request__description'>
                        <WalletText align='center'>
                            Click the button below and we’ll send you an email with a link. Click that link to verify
                            your withdrawal request.
                        </WalletText>
                        <WalletText align='center'>
                            This is to protect your account from unauthorised withdrawals.
                        </WalletText>
                    </div>
                }
                icon={
                    <div className='wallets-withdrawal-verification-request__icon'>
                        <EmailVerification />
                    </div>
                }
                onAction={sendEmail}
                title='Please help us verify your withdrawal request.'
            />
        </div>
    );
};

export default WithdrawalVerificationRequest;
