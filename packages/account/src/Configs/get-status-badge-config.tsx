import React from 'react';
import { Text } from '@deriv/components';
import { ACCOUNT_BADGE_STATUS, TAccountBadgeStatus } from '@deriv/shared';
import { Localize } from '@deriv/translations';

const getStatusBadgeConfig = (account_status: TAccountBadgeStatus, onClickBanner?: () => void) => {
    const handleOnClick = () => {
        if (onClickBanner) {
            onClickBanner();
        }
    };
    switch (account_status) {
        case ACCOUNT_BADGE_STATUS.PENDING:
            return {
                text: (
                    <Localize
                        i18n_default_text='<0>In review</0>'
                        components={[<Text key={0} weight='bold' size='xxxs' color='var(--status-warning)' />]}
                    />
                ),
                icon: 'IcAlertWarning',
                icon_size: '18',
            };
        case ACCOUNT_BADGE_STATUS.FAILED:
            return {
                text: (
                    <Localize
                        i18n_default_text='<0>Failed</0>'
                        components={[
                            <Text
                                key={0}
                                weight='bold'
                                size='xxxs'
                                color='var(--status-danger)'
                                onClick={handleOnClick}
                            />,
                        ]}
                    />
                ),
                icon: 'IcRedWarning',
                icon_size: '18',
            };
        case ACCOUNT_BADGE_STATUS.NEEDS_VERIFICATION: {
            return {
                text: (
                    <Localize
                        i18n_default_text='<0>Needs Verification</0>'
                        components={[
                            <Text
                                key={0}
                                weight='bold'
                                size='xxxs'
                                color='var(--status-info)'
                                onClick={handleOnClick}
                            />,
                        ]}
                    />
                ),
                icon: 'IcMt5Verification',
                icon_size: '18',
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
