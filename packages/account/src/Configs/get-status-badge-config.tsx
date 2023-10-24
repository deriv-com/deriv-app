import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { AccountStatus } from '@deriv/shared';

const getStatusBadgeConfig = (
    account_status: string,
    openFailedVerificationModal: (selected_account_type: string) => void,
    selected_account_type: string,
    setIsVerificationModalVisible?: (value: boolean) => void
) => {
    switch (account_status) {
        case AccountStatus.PENDING:
            return {
                text: (
                    <Localize
                        i18n_default_text='<0>Pending verification</0>'
                        components={[<Text key={0} weight='bold' size='xxxs' color='var(--status-warning)' />]}
                    />
                ),
                icon: 'IcAlertWarning',
            };
        case AccountStatus.FAILED:
            return {
                text: (
                    <Localize
                        i18n_default_text='<0>Verification failed.</0> <1>Why?</1>'
                        components={[
                            <Text key={0} weight='bold' size='xxxs' color='var(--status-danger)' />,
                            <Text
                                key={1}
                                className='link-verification-failed'
                                onClick={() => {
                                    openFailedVerificationModal(selected_account_type);
                                }}
                            />,
                        ]}
                    />
                ),
                icon: 'IcRedWarning',
            };
        case AccountStatus.NEEDS_VERIFICATION:
            return {
                text: (
                    <Localize
                        i18n_default_text='<0>Needs verification.</0><1>Verify now</1>'
                        components={[
                            <Text key={0} weight='bold' size='xxxs' color='var(--status-info)' />,
                            <Text
                                key={1}
                                className='link-need-verification'
                                onClick={() => setIsVerificationModalVisible?.(true)}
                            />,
                        ]}
                    />
                ),
                icon: 'IcAlertInfo',
            };
        default:
            return {
                text: '',
                icon: '',
            };
    }
};

export default getStatusBadgeConfig;
