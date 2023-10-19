import React from 'react';
import EmailVerification from '../../../../../public/images/email-verification.svg';
import './WithdrawalVerificationRequest.scss';

type TProps = {
    sendEmail: () => void;
};

const WithdrawalVerificationRequest: React.FC<TProps> = ({ sendEmail }) => {
    return (
        <div className='wallets-withdrawal-verification-request'>
            <div className='wallets-withdrawal-verification-request-icon'>
                <EmailVerification />
            </div>
            <div className='wallets-withdrawal-verification-request__messages'>
                <p className='wallets-withdrawal-verification-request__title'>
                    Please help us verify your withdrawal request.
                </p>
                <p className='wallets-withdrawal-verification-request__description'>
                    <span>
                        Click the button below and we’ll send you an email with a link. Click that link to verify your
                        withdrawal request.
                    </span>
                    <span>This is to protect your account from unauthorised withdrawals.</span>
                </p>
            </div>
            <button className='wallets-withdrawal-verification-request__send-button' onClick={sendEmail}>
                Send email
            </button>
        </div>
    );
};

export default WithdrawalVerificationRequest;
