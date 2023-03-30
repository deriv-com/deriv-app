import React from 'react';
import { observer } from 'mobx-react-lite';
import { getStatusBadgeConfig } from '@deriv/account';
import { StatusBadge, Text } from '@deriv/components';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import CurrencySwitcherLoader from 'Components/pre-loader/currency-switcher-loader';
import { useStores } from 'Stores/index';
import RealAccountCard from './real-account-card';
import './real-account-switcher.scss';

type AccountNeedsVerificationProps = {
    multipliers_account_status: string;
};
const AccountNeedsVerification = observer(({ multipliers_account_status }: AccountNeedsVerificationProps) => {
    const { client, traders_hub } = useStores();
    const { account_list, loginid } = client;
    const { openModal, openFailedVerificationModal } = traders_hub;

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
            onClick={() => {
                return openModal('currency_selection');
            }}
        >
            <StatusBadge account_status={multipliers_account_status} icon={badge_icon} text={badge_text} />
        </CurrencySwitcherContainer>
    );
});

const RealAccountSwitcher = () => {
    const { client, traders_hub } = useStores();
    const { is_logging_in, is_switching, has_maltainvest_account } = client;
    const {
        multipliers_account_status,

        is_eu_user,
        no_CR_account,
        no_MF_account,
    } = traders_hub;

    const eu_account = is_eu_user && !no_MF_account;
    const cr_account = !is_eu_user && !no_CR_account;

    //dont show loader if user has no respective regional account
    if ((is_switching || is_logging_in) && (eu_account || cr_account)) {
        return (
            <div className='real-account-switcher__container content-loader'>
                <CurrencySwitcherLoader />
            </div>
        );
    }

    if (multipliers_account_status && is_eu_user) {
        return <AccountNeedsVerification multipliers_account_status={multipliers_account_status} />;
    }

    if (has_maltainvest_account && is_eu_user) {
        return <RealAccountCard />;
    } else if (!no_CR_account && !is_eu_user) {
        return <RealAccountCard />;
    }
    return null;
};

export default observer(RealAccountSwitcher);
