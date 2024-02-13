import React, { useState } from 'react';
// import { WalletButton, WalletsActionScreen } from '../../../../../components';
import { Button } from '@deriv-com/ui';
import EmailSent from '../../../assets/images/email-verification.svg';
// import { WalletButtonGroup } from '../../../components/WalletButtonGroup';
import { ActionScreen } from '../../../components/ActionScreen';
import './WithdrawalVerificationSent.scss';

type TProps = {
    counter: number;
    sendEmail: () => void;
};

const WithdrawalVerificationSent: React.FC<TProps> = ({ counter, sendEmail }) => {
    const [showResend, setShowResend] = useState(false);

    return (
        <div className='wallets-withdrawal-verification-sent'>
            <ActionScreen
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
                                  onClick={() => {
                                      sendEmail();
                                      setShowResend(!showResend);
                                  }}
                                  size='lg'
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
                    <ActionScreen
                        description="Check your spam or junk folder. If it's not there, try resending the email."
                        renderButtons={() => (
                            <Button disabled={!!counter} onClick={sendEmail} size='lg'>
                                Resend email{counter ? ` in ${counter}s` : ''}
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
