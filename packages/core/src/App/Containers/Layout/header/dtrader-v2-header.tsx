import React from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import HeaderAccountActionsDTraderV2 from 'App/Components/Layout/Header/dtrader-v2/header-account-actions-dtrader-v2';
import BannerDtraderV2 from 'App/Components/Layout/Header/dtrader-v2/banner-dtrader-v2';

const DTraderV2Header = observer(() => {
    const { ui, client, traders_hub } = useStore();
    const { is_real_acc_signup_on, setShouldShowCooldownModal, openRealAccountSignup } = ui;
    const { has_any_real_account, is_eu, real_account_creation_unlock_date } = client;
    const { selectRegion } = traders_hub;

    const openRealAccount = () => {
        if (real_account_creation_unlock_date) {
            setShouldShowCooldownModal(true);
        } else {
            selectRegion(is_eu ? 'EU' : 'Non-EU');
            openRealAccountSignup(is_eu ? 'maltainvest' : 'svg');
        }
    };

    return (
        <header
            className={classNames('header header-v2', {
                'header-v2--with-banner': !has_any_real_account,
            })}
        >
            <React.Suspense fallback={<div />}>
                {!has_any_real_account && <BannerDtraderV2 openRealAccount={openRealAccount} />}
                <HeaderAccountActionsDTraderV2 />
                {is_real_acc_signup_on && <RealAccountSignup />}
                <SetAccountCurrencyModal />
            </React.Suspense>
        </header>
    );
});

export default DTraderV2Header;
