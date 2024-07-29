import React, { useState } from 'react';
import { Button } from '@deriv-com/ui';
import { WalletsActionScreen } from '../../../../../components';
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
                    <div
                        className='wallets-withdrawal-verification-sent__icon'
                        data-testid='dt_withdrawal_verification_sent_icon'
                    >
                        <EmailSent />
                    </div>
                }
                renderButtons={
                    !showResend
                        ? () => (
                              <Button
                                  borderWidth='sm'
                                  color='primary-transparent'
                                  onClick={() => {
                                      sendEmail();
                                      setShowResend(!showResend);
                                  }}
                                  size='lg'
                                  textSize='md'
                                  variant='ghost'
                              >
                                  Didn&apos;t receive the email?
                              </Button>
                          )
                        : undefined
                }
                title="We've sent you an email."
            />
            <div className='wallets-withdrawal-verification-sent__resend'>
                {showResend && (
                    <WalletsActionScreen
                        description="Check your spam or junk folder. If it's not there, try resending the email."
                        renderButtons={() => (
                            <Button borderWidth='sm' disabled={!!counter} onClick={sendEmail} size='lg' textSize='md'>
                                {`Resend email${counter ? ` in ${counter}s` : ''}`}
                            </Button>
                        )}
                        title="Didn't receive the email?"
                    />
                )}
            </div>
        </div>
    );
};

export default WithdrawalVerificationSent;
