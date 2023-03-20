import React from 'react';
import { getStatusBadgeConfig } from '@deriv/account';
import { StatusBadge, Text } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import RealAccountCard from './real-account-card';
import './real-account-switcher.scss';

const AccountNeedsVerification = observer(() => {
    const { client, traders_hub } = useStore();
    const { account_list, loginid } = client;
    const { openModal, openFailedVerificationModal, multipliers_account_status } = traders_hub;
    const title = account_list.find((acc: { loginid: string }) => loginid === acc.loginid).title;
    const icon = account_list.find((acc: { loginid: string }) => loginid === acc.loginid).icon;

    const { text: badge_text, icon: badge_icon } = getStatusBadgeConfig(
        multipliers_account_status,
        openFailedVerificationModal,
        'multipliers'
    );

    return (
        <CurrencySwitcherContainer
            className='real-account-switcher__container'
            title={
                <Text size='xs' line_height='s'>
                    {title}
                </Text>
            }
            icon={icon}
            onClick={() => openModal('currency_selection')}
        >
            <StatusBadge account_status={multipliers_account_status} icon={badge_icon} text={badge_text} />
        </CurrencySwitcherContainer>
    );
});

const RealAccountSwitcher = observer(() => {
    const { client, traders_hub } = useStore();
    const { has_maltainvest_account } = client;
    const { multipliers_account_status, is_eu_user, no_CR_account } = traders_hub;

    if (multipliers_account_status && is_eu_user) return <AccountNeedsVerification />;
    if (has_maltainvest_account && is_eu_user) return <RealAccountCard />;
    if (!no_CR_account && !is_eu_user) return <RealAccountCard />;

    return <></>;
});

export default RealAccountSwitcher;
