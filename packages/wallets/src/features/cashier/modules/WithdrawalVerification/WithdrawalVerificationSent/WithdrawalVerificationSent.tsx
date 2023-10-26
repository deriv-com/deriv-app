import React, { useState } from 'react';
import EmailSent from '../../../../../public/images/email-sent.svg';
import WalletsActionScreen from '../../../../../components/WalletsActionScreen/WalletsActionScreen';
import './WithdrawalVerificationSent.scss';

type TProps = {
    counter: number;
    sendEmail: () => void;
};

const WithdrawalVerificationSent: React.FC<TProps> = ({ counter, sendEmail }) => {
    const [showResend, setShowResend] = useState(false);

    return (
        <div className='wallets-withdrawal-verification-sent'>
            <WalletsActionScreen
                actionText={!showResend && 'Didn’t receive the email?'}
                actionVariant='ghost'
                description='Please check your email for the verification link to complete the process.'
                icon={
                    <div className='wallets-withdrawal-verification-sent__icon'>
                        <EmailSent />
                    </div>
                }
                onAction={() => {
                    sendEmail();
                    setShowResend(!showResend);
                }}
                title='We’ve sent you an email.'
            />
            <div className='wallets-withdrawal-verification-sent__resend'>
                {showResend && (
                    <WalletsActionScreen
                        actionText={`Resend email${counter ? ` in ${counter}s` : ''}`}
                        description='Check your spam or junk folder. If it’s not there, try resending the email.'
                        disabled={!!counter}
                        onAction={sendEmail}
                        title='Didn’t receive the email?'
                    />
                )}
            </div>
        </div>
    );
};

export default WithdrawalVerificationSent;
