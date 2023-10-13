import React from 'react';
import EmailVerification from '../../public/images/email-verification.svg';
import './WalletWithdrawalVerification.scss';

type TProps = {
    sendEmail: () => void;
};

const WalletWithdrawalVerification: React.FC<TProps> = ({ sendEmail }) => {
    return (
        <div className='wallets-withdrawal-verification'>
            <EmailVerification />
            <p className='wallets-withdrawal-verification__title'>Please help us verify your withdrawal request.</p>
            <p className='wallets-withdrawal-verification__description'>
                <span>
                    Click the button below and we’ll send you an email with a link. Click that link to verify your
                    withdrawal request.
                </span>
                <span>This is to protect your account from unauthorised withdrawals.</span>
            </p>
            <button className='wallets-withdrawal-verification__send-button' onClick={sendEmail}>
                Send email
            </button>
        </div>
    );
};

export default WalletWithdrawalVerification;
