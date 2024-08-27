import React from 'react';
import { Text } from '@deriv/components';
import { AUTH_STATUS_CODES, ACCOUNT_BADGE_STATUS, routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { TAuthStatusCodes, TAccountBadgeStatus } from '../Types/common.type';
import { Link } from 'react-router-dom';

const getStatusBadgeConfig = (
    account_status: TAccountBadgeStatus,
    openFailedVerificationModal: () => void,
    setIsVerificationModalVisible?: (value: boolean) => void,
    kyc_account_status?: { poi_status?: TAuthStatusCodes; poa_status?: TAuthStatusCodes }
) => {
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
                                    openFailedVerificationModal();
                                }}
                            />,
                        ]}
                    />
                ),
                icon: 'IcRedWarning',
            };
        case ACCOUNT_BADGE_STATUS.NEEDS_VERIFICATION: {
            const redirect_url =
                kyc_account_status?.poi_status === AUTH_STATUS_CODES.NONE
                    ? routes.proof_of_identity
                    : routes.proof_of_address;
            return {
                text: (
                    <Localize
                        i18n_default_text='<0>Needs verification.</0><1>Verify now</1>'
                        components={[
                            <Text key={0} weight='bold' size='xxxs' color='var(--status-info)' />,
                            setIsVerificationModalVisible ? (
                                <Text
                                    key={1}
                                    className='link-need-verification'
                                    onClick={() => setIsVerificationModalVisible?.(true)}
                                />
                            ) : (
                                <Link key={1} className='link-need-verification' to={redirect_url} />
                            ),
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
