import React from 'react';
import { Icon, Text } from '@deriv/components';
import styles from './verification-status.module.scss';

type TVerificationStatus = {
    children?: React.ReactElement | null;
    icon: string;
    is_mobile?: boolean;
    status_description?: React.ReactElement | null;
    status_title: React.ReactElement | null;
};

const VerificationStatus = ({ children, icon, is_mobile, status_description, status_title }: TVerificationStatus) => {
    return (
        <div className={styles.container}>
            <Icon icon={icon} size={128} />
            <Text
                as='div'
                color='general'
                size={is_mobile ? 'xs' : 's'}
                weight='bold'
                align='center'
                className={styles.statusTitle}
            >
                {status_title}
            </Text>
            {status_description && (
                <Text
                    as='div'
                    color='general'
                    size={is_mobile ? 'xxs' : 'xs'}
                    align='center'
                    className={styles.statusDescription}
                >
                    {status_description}
                </Text>
            )}
            {children}
        </div>
    );
};
export default VerificationStatus;
