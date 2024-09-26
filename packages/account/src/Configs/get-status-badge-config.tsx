import React from 'react';
import { Text } from '@deriv/components';
import { ACCOUNT_BADGE_STATUS, TAccountBadgeStatus } from '@deriv/shared';
import { Localize } from '@deriv-com/translations';

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
                        components={[
                            <Text
                                key={0}
                                weight='bold'
                                size='xxs'
                                color='var(--status-warning)'
                                onClick={handleOnClick}
                            />,
                        ]}
                    />
                ),
                icon: 'IcMt5Pending',
            };
        case ACCOUNT_BADGE_STATUS.FAILED:
            return {
                text: (
                    <Localize
                        i18n_default_text='<0>Failed</0>'
                        components={[
                            <Text key={0} weight='bold' size='xxs' color='loss-danger' onClick={handleOnClick} />,
                        ]}
                    />
                ),
                icon: 'IcMt5Failed',
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
                                size='xxs'
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
