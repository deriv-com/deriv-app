import React from 'react';
import { Text } from '@deriv/components';
import { ACCOUNT_BADGE_STATUS } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { TAccountBadgeStatus } from '../Types/common.type';

const getStatusBadgeConfig = (account_status: TAccountBadgeStatus, openVerificationDocsListModal: () => void) => {
    switch (account_status) {
        case ACCOUNT_BADGE_STATUS.PENDING:
            return {
                text: (
                    <Localize
                        i18n_default_text='<0>Pending verification</0>'
                        components={[<Text key={0} weight='bold' size='xxxs' color='var(--status-warning)' />]}
                    />
                ),
                icon: 'IcAlertWarning',
            };
        case ACCOUNT_BADGE_STATUS.FAILED:
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
                                    openVerificationDocsListModal();
                                }}
                            />,
                        ]}
                    />
                ),
                icon: 'IcRedWarning',
            };
        case ACCOUNT_BADGE_STATUS.NEEDS_VERIFICATION: {
            return {
                text: (
                    <Localize
                        i18n_default_text='<0>Needs verification.</0><1>Verify now</1>'
                        components={[
                            <Text key={0} weight='bold' size='xxxs' color='var(--status-info)' />,
                            <Text
                                key={1}
                                className='link-need-verification'
                                onClick={() => {
                                    openVerificationDocsListModal();
                                }}
                            />,
                        ]}
                    />
                ),
                icon: 'IcAlertInfo',
            };
        }
        default:
            return {
                text: '',
                icon: '',
            };
    }
};

export default getStatusBadgeConfig;
