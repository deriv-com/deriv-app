import React from 'react';
import { observer } from 'mobx-react-lite';
import { StatusBadge } from '@deriv/components';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import CurrencySwitcherLoader from 'Components/pre-loader/currency-switcher-loader';
import { useStores } from 'Stores/index';
import RealAccountCard from './real-account-card';
import './real-account-switcher.scss';

const AccountNeedsVerification = observer(() => {
    const { client, traders_hub } = useStores();
    const {
        authentication_status: { document_status },
        account_list,
        loginid,
    } = client;
    const { openModal, openFailedVerificationModal } = traders_hub;

    const title = account_list.find((acc: { loginid: string }) => loginid === acc.loginid).title;
    const icon = account_list.find((acc: { loginid: string }) => loginid === acc.loginid).icon;

    return (
        <CurrencySwitcherContainer
            className='real-account-switcher__container'
            title={title}
            icon={icon}
            onClick={() => {
                openModal('currency_selection');
            }}
        >
            <StatusBadge
                account_status={document_status}
                openFailedVerificationModal={openFailedVerificationModal}
                selected_account_type='multipliers'
            />
        </CurrencySwitcherContainer>
    );
});

const RealAccountSwitcher = () => {
    const { client } = useStores();
    const { is_authentication_needed, is_switching, is_logging_in, has_any_real_account } = client;

    if (is_switching || is_logging_in) {
        return (
            <div className='real-account-switcher__container loader'>
                <CurrencySwitcherLoader />
            </div>
        );
    }

    if (is_authentication_needed) {
        return <AccountNeedsVerification />;
    }

    if (has_any_real_account) {
        return <RealAccountCard />;
    }

    return null;
};

export default observer(RealAccountSwitcher);
