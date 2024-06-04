import React, { useState } from 'react';
import { ActionScreen, Button } from '@deriv-com/ui';
import EmailSent from '../../../assets/images/email-verification.svg';
import styles from './WithdrawalVerificationSent.module.scss';

type TProps = {
    counter: number;
    sendEmail: () => void;
};

const WithdrawalVerificationSent: React.FC<TProps> = ({ counter, sendEmail }) => {
    const [showResend, setShowResend] = useState(false);

    return (
        <div>
            <ActionScreen
                actionButtons={
                    !showResend ? (
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
                    ) : undefined
                }
                description='Please check your email for the verification link to complete the process.'
                icon={
                    <div className={styles.icon} data-testid='dt_withdrawal_verification_sent_icon'>
                        <EmailSent />
                    </div>
                }
                title="We've sent you an email."
            />
            <div className={styles.resend}>
                {showResend && (
                    <ActionScreen
                        actionButtons={
                            <Button disabled={!!counter} onClick={sendEmail} size='lg'>
                                Resend email{counter ? ` in ${counter}s` : ''}
                            </Button>
                        }
                        description="Check your spam or junk folder. If it's not there, try resending the email."
                        title="Didn't receive the email?"
                    />
                )}
            </div>
        </div>
    );
};

export default WithdrawalVerificationSent;
