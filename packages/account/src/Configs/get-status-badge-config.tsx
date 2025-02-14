import React from 'react';
import { Text } from '@deriv/components';
import { ACCOUNT_BADGE_STATUS, MT5_ACCOUNT_STATUS, TAccountBadgeStatus, TRADING_PLATFORM_STATUS } from '@deriv/shared';
import { Localize } from '@deriv-com/translations';

const getStatusBadgeConfig = (account_status: TAccountBadgeStatus) => {
    const BadgeTextComponent = <Text key={0} weight='bold' size='xxxs' color='warning' />;

    switch (account_status) {
        case ACCOUNT_BADGE_STATUS.PENDING:
            return {
                text: <Localize i18n_default_text='In review' />,
                icon: 'IcMt5Pending',
            };
        case ACCOUNT_BADGE_STATUS.FAILED:
            return {
                text: <Localize i18n_default_text='Failed' />,
                icon: 'IcMt5Failed',
                icon_size: '18',
            };
        case ACCOUNT_BADGE_STATUS.NEEDS_VERIFICATION:
            return {
                text: <Localize i18n_default_text='Needs Verification' />,
                icon: 'IcMt5Verification',
                icon_size: '18',
            };
        case MT5_ACCOUNT_STATUS.UNDER_MAINTENANCE:
            return {
                text: <Localize i18n_default_text='<0>Server maintenance</0>' components={[BadgeTextComponent]} />,
                icon: 'IcAlertWarning',
            };
        case TRADING_PLATFORM_STATUS.UNAVAILABLE:
            return {
                text: <Localize i18n_default_text='<0>Temporarily Unavailable</0>' components={[BadgeTextComponent]} />,
                icon: 'IcAlertWarning',
            };
        default:
            return {
                text: '',
                icon: '',
            };
    }
};

export default getStatusBadgeConfig;
