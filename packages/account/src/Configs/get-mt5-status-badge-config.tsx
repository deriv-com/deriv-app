import React from 'react';
import { Text } from '@deriv/components';
import { MT5_ACCOUNT_STATUS, TRADING_PLATFORM_STATUS } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { TMT5AccountStatus } from '../Types/common.type';

const getMT5StatusBadgeConfig = (mt5_account_status: TMT5AccountStatus) => {
    const BadgeTextComponent = <Text key={0} weight='bold' size='xxxs' color='warning' />;

    switch (mt5_account_status) {
        case MT5_ACCOUNT_STATUS.PENDING:
            return {
                text: (
                    <Localize
                        i18n_default_text='<0>Pending verification</0>'
                        components={[<Text key={0} weight='bold' size='xxxs' color='var(--status-warning)' />]}
                    />
                ),
                icon: 'IcAlertWarning',
            };
        case MT5_ACCOUNT_STATUS.FAILED:
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
                                    //TODO: default jurisdiction;
                                }}
                            />,
                        ]}
                    />
                ),
                icon: 'IcRedWarning',
            };
        case MT5_ACCOUNT_STATUS.NEEDS_VERIFICATION: {
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
                                    //TODO: default jurisdiction;
                                }}
                            />,
                        ]}
                    />
                ),
                icon: 'IcAlertInfo',
            };
        }
        case MT5_ACCOUNT_STATUS.MIGRATED_WITH_POSITION:
            return {
                text: <Localize i18n_default_text='<0>No new positions</0>' components={[BadgeTextComponent]} />,
                icon: 'IcAlertWarning',
            };
        case MT5_ACCOUNT_STATUS.MIGRATED_WITHOUT_POSITION:
            return {
                text: <Localize i18n_default_text='<0>Account closed</0>' components={[BadgeTextComponent]} />,
                icon: 'IcAlertWarning',
            };
        case MT5_ACCOUNT_STATUS.UNDER_MAINTENANCE:
            return {
                text: <Localize i18n_default_text='<0>Server maintenance</0>' components={[BadgeTextComponent]} />,
                icon: 'IcAlertWarning',
            };
        case TRADING_PLATFORM_STATUS.UNAVAILABLE:
            return {
                text: <Localize i18n_default_text='<0>Unavailable</0>' components={[BadgeTextComponent]} />,
                icon: 'IcAlertWarning',
            };
        default:
            return {
                text: '',
                icon: '',
            };
    }
};

export default getMT5StatusBadgeConfig;
