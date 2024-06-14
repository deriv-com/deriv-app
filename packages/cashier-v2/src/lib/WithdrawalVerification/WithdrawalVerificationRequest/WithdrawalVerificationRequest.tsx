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
                        <Text align='center'>Hit the button below, and we&apos;ll email you a verification link.</Text>
                        <Text align='center'>This is to confirm that it&apos;s you making the withdrawal request.</Text>
                    </div>
                }
                icon={
                    <div className={styles.icon} data-testid='dt_withdrawal_verification_request_icon'>
                        <EmailVerification />
                    </div>
                }
                title='Confirm your identity to make a withdrawal.'
            />
        </div>
    );
};

export default WithdrawalVerificationRequest;
