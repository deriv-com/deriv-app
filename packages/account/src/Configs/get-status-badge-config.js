import React from 'react';
import { Link } from 'react-router-dom';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const getStatusBadgeConfig = (account_status, openFailedVerificationModal, selected_account_type) => {
    switch (account_status) {
        case 'pending':
            return {
                text: (
                    <Localize
                        i18n_default_text='<0>Pending verification</0>'
                        components={[<Text key={0} weight='bold' size='xxxs' color='var(--status-warning)' />]}
                    />
                ),
                icon: 'IcAlertWarning',
            };
        case 'failed':
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
        case 'need_verification':
            return {
                text: (
                    <Localize
                        i18n_default_text='<0>Need verification.</0><1>Verify now</1>'
                        components={[
                            <Text key={0} weight='bold' size='xxxs' color='var(--status-info)' />,
                            <Link key={1} className='link-need-verification' to='/account/proof-of-identity' />,
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
