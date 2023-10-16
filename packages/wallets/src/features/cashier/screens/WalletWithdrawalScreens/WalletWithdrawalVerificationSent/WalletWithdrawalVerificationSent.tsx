import React, { useState } from 'react';
import EmailSent from '../../../../../public/images/email-sent.svg';
import './WalletWithdrawalVerificationSent.scss';

type TProps = {
    counter: number;
    sendEmail: () => void;
};

const WalletWithdrawalVerificationSent: React.FC<TProps> = ({ counter, sendEmail }) => {
    const [showResend, setShowResend] = useState(false);

    return (
        <div className='wallets-withdrawal-verification-sent'>
            <div className='wallets-withdrawal-verification-sent-icon'>
                <EmailSent />
            </div>

            <div className='wallets-withdrawal-verification-sent__messages'>
                <p className='wallets-withdrawal-verification-sent__title'>We’ve sent you an email.</p>
                <p className='wallets-withdrawal-verification-sent__description'>
                    Please check your email for the verification link to complete the process.
                </p>
            </div>
            {!showResend && (
                <button
                    className='wallets-withdrawal-verification-sent__link-button'
                    onClick={() => setShowResend(!showResend)}
                >
                    Didn’t receive the email?
                </button>
            )}
            {showResend && (
                <div className='wallets-withdrawal-verification-sent__resend'>
                    <div className='wallets-withdrawal-verification-sent__resend-content'>
                        <p className='wallets-withdrawal-verification-sent__resend-content__title'>
                            Didn’t receive the email?
                        </p>
                        <p>Check your spam or junk folder. If it’s not there, try resending the email.</p>
                    </div>
                    <button
                        className='wallets-withdrawal-verification-sent__resend-button'
                        disabled={!!counter}
                        onClick={sendEmail}
                    >
                        Resend email{counter ? ` in ${counter}s` : ''}
                    </button>
                </div>
            )}
        </div>
    );
};

export default WalletWithdrawalVerificationSent;
