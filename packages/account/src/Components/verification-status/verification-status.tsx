import { Button, Icon, Text } from '@deriv/components';
import React from 'react';
import styles from './verifications-status.module.scss';
import { RedirectButton } from 'Components/redirect-button';
import { isNavigationFromDerivGO, isNavigationFromP2P } from '@deriv/shared';

type TVerificationStatusBase = {
    icon: string;
    needs_poa?: boolean;
    needs_poi?: boolean;
    status_description: React.ReactElement | null;
    status_title: React.ReactElement;
};

type TNeedsPOA = {
    needs_poa?: boolean;
    needs_poi?: never;
};

type TNeedsPOI = {
    needs_poa?: never;
    needs_poi?: boolean;
};

type WithButtonText = {
    action_button?: React.ReactNode;
    should_show_redirect_btn?: never;
};

type WithoutButtonText = {
    button_text?: never;
    onClick?: never;
    should_show_redirect_btn?: boolean;
};

type TVerificationStatus = TVerificationStatusBase & (WithButtonText | WithoutButtonText) & (TNeedsPOA | TNeedsPOI);

const VerificationStatus = ({
    action_button,
    should_show_redirect_btn,
    icon,
    needs_poa,
    needs_poi,
    status_description,
    status_title,
}: TVerificationStatus) => {
    return (
        <div className={styles.container}>
            <Icon icon={icon} size={128} />
            <Text as='div' color='general' weight='bold' size='s' align='center' className={styles.status_title}>
                {status_title}
            </Text>
            {status_description && (
                <Text as='div' color='general' size='xs' align='center' className={styles.status_description}>
                    {status_description}
                </Text>
            )}
            {action_button}
        </div>
    );
};
export default VerificationStatus;
