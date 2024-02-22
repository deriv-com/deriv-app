import React from 'react';
import { ActionScreen, Button, Text } from '@deriv-com/ui';
import EmailVerification from '../../../assets/images/email-verification.svg';
import styles from './WithdrawalVerificationRequest.module.scss';

type TProps = {
    sendEmail: () => void;
};

const WithdrawalVerificationRequest: React.FC<TProps> = ({ sendEmail }) => {
    return (
        <div className={styles.container}>
            <ActionScreen
                actionButtons={
                    <Button onClick={sendEmail} size='lg'>
                        Send email
                    </Button>
                }
                description={
                    <div className={styles.description}>
                        <Text align='center'>
                            Click the button below and we&apos;ll send you an email with a link. Click that link to
                            verify your withdrawal request.
                        </Text>
                        <Text align='center'>This is to protect your account from unauthorised withdrawals.</Text>
                    </div>
                }
                icon={
                    <div className={styles.icon} data-testid='dt_withdrawal_verification_request_icon'>
                        <EmailVerification />
                    </div>
                }
                title='Please help us verify your withdrawal request.'
            />
        </div>
    );
};

export default WithdrawalVerificationRequest;
