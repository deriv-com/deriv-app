import React, { useState } from 'react';
import { WalletButton, WalletsActionScreen } from '../../../../../components';
import EmailSent from '../../../../../public/images/email-sent.svg';
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
                description='Please check your email for the verification link to complete the process.'
                icon={
                    <div className='wallets-withdrawal-verification-sent__icon'>
                        <EmailSent />
                    </div>
                }
                renderButtons={
                    !showResend
                        ? () => (
                              <WalletButton
                                  onClick={() => {
                                      sendEmail();
                                      setShowResend(!showResend);
                                  }}
                                  size='lg'
                                  text='Didn’t receive the email?'
                                  variant='ghost'
                              />
                          )
                        : undefined
                }
                title='We’ve sent you an email.'
            />
            <div className='wallets-withdrawal-verification-sent__resend'>
                {showResend && (
                    <WalletsActionScreen
                        description='Check your spam or junk folder. If it’s not there, try resending the email.'
                        renderButtons={() => (
                            <WalletButton
                                disabled={!!counter}
                                onClick={sendEmail}
                                size='lg'
                                text={`Resend email${counter ? ` in ${counter}s` : ''}`}
                            />
                        )}
                        title='Didn’t receive the email?'
                    />
                )}
            </div>
        </div>
    );
};

export default WithdrawalVerificationSent;
