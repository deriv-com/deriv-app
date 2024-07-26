import React, { useState } from 'react';
import { Localize, useTranslations } from '@deriv-com/translations';
import { WalletButton, WalletsActionScreen } from '../../../../../components';
import EmailSent from '../../../../../public/images/email-sent.svg';
import './WithdrawalVerificationSent.scss';

type TProps = {
    counter: number;
    sendEmail: () => void;
};

const WithdrawalVerificationSent: React.FC<TProps> = ({ counter, sendEmail }) => {
    const { localize } = useTranslations();
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
                              <WalletButton
                                  onClick={() => {
                                      sendEmail();
                                      setShowResend(!showResend);
                                  }}
                                  size='lg'
                                  variant='ghost'
                              >
                                  <Localize i18n_default_text="Didn't receive the email?" />
                              </WalletButton>
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
                            <WalletButton disabled={!!counter} onClick={sendEmail} size='lg'>
                                <Localize
                                    i18n_default_text='Resend email{{counter}}'
                                    values={{ counter: counter ? localize(' in {{counter}}s', { counter }) : '' }}
                                />
                            </WalletButton>
                        )}
                        title={<Localize i18n_default_text="Didn't receive the email?" />}
                    />
                )}
            </div>
        </div>
    );
};

export default WithdrawalVerificationSent;
