import React, { useState } from 'react';
import useCountdown from '../../hooks/useCountdown';
import EmailSent from '../../public/images/email-sent.svg';
import './WalletWithdrawalVerificationSent.scss';

type TProps = {
    counter: ReturnType<typeof useCountdown>;
    sendEmail: () => void;
};

const WalletWithdrawalVerificationSent: React.FC<TProps> = ({ counter, sendEmail }) => {
    const [showResend, setShowResend] = useState(false);

    return (
        <div className='wallets-withdrawal-verification-sent'>
            <EmailSent />
            <p className='wallets-withdrawal-verification-sent__title'>We’ve sent you an email.</p>
            <p className='wallets-withdrawal-verification-sent__description'>
                Please check your email for the verification link to complete the process.
            </p>
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
                        disabled={!!counter.count}
                        onClick={sendEmail}
                    >
                        Resend email{counter.count ? ` in ${counter.count}s` : ''}
                    </button>
                </div>
            )}
        </div>
    );
};

export default WalletWithdrawalVerificationSent;
