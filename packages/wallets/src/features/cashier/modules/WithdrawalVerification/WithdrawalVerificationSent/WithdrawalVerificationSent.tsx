import React, { useState } from 'react';
import { Localize } from '@deriv-com/translations';
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
                description={
                    <Localize i18n_default_text='Please check your email for the verification link to complete the process.' />
                }
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
                                  <Localize i18n_default_text="Didn't receive the email?" />
                              </Button>
                          )
                        : undefined
                }
                title={<Localize i18n_default_text="We've sent you an email." />}
            />
            <div className='wallets-withdrawal-verification-sent__resend'>
                {showResend && (
                    <WalletsActionScreen
                        description={
                            <Localize i18n_default_text="Check your spam or junk folder. If it's not there, try resending the email." />
                        }
                        renderButtons={() => (
                            <Button disabled={!!counter} onClick={sendEmail} size='lg' textSize='md'>
                                {counter ? (
                                    <Localize i18n_default_text='Resend email in {{counter}}s' values={{ counter }} />
                                ) : (
                                    <Localize i18n_default_text='Resend email' />
                                )}
                            </Button>
                        )}
                        title={<Localize i18n_default_text="Didn't receive the email?" />}
                    />
                )}
            </div>
        </div>
    );
};

export default WithdrawalVerificationSent;
