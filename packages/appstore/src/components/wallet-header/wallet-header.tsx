import React from 'react';
import { Icon } from '@deriv/components';
import classNames from 'classnames';
import WalletCurrencyCard from './wallet-currency-card';
import WalletHeaderButtons from './wallet-header-buttons';
import WalletHeaderTitle from './wallet-header-title';
import WalletHeaderBalance from './wallet-header-balance';
import { TWalletAccount } from 'Types';
import { getWalletHeaderButtons } from 'Constants/utils';
import { observer, useStore } from '@deriv/stores';
import './wallet-header.scss';
import { useMFAccountStatus } from '@deriv/hooks';

type TWalletHeader = {
    wallet_account: TWalletAccount;
};

const WalletHeader = observer(({ wallet_account }: TWalletHeader) => {
    const { client } = useStore();
    const { switchAccount, loginid } = client;
    const is_active = wallet_account.is_selected;
    const mf_account_status = useMFAccountStatus();

    const { is_demo, currency, gradient_card_class, currency_config, icon, balance, landing_company_name } =
        wallet_account;

    const wallet_buttons = getWalletHeaderButtons(wallet_account.is_demo);

    const onArrowClickHandler = async () => {
        if (loginid !== wallet_account.loginid) await switchAccount(wallet_account.loginid);
    };

    return (
        <div className={classNames('wallet-header', { 'wallet-header__demo': is_demo })}>
            <div className='wallet-header__container'>
                <WalletCurrencyCard
                    is_demo={is_demo}
                    currency={currency}
                    gradient_class={gradient_card_class}
                    icon={icon}
                    icon_type={currency_config?.type}
                />
                <div className='wallet-header__description'>
                    <WalletHeaderTitle
                        is_demo={is_demo}
                        currency={currency}
                        landing_company_name={landing_company_name}
                    />
                    <WalletHeaderButtons
                        is_disabled={!!mf_account_status}
                        is_open={is_active}
                        buttons={wallet_buttons}
                        wallet_account={wallet_account}
                    />
                </div>
                <div className='wallet-header__balance'>
                    <WalletHeaderBalance balance={balance} currency={currency} />
                    <Icon
                        data_testid='dt_arrow'
                        onClick={onArrowClickHandler}
                        icon='IcChevronDownBold'
                        className={classNames('wallet-header__balance-arrow-icon', {
                            'wallet-header__balance-arrow-icon-active': is_active,
                        })}
                    />
                </div>
            </div>
        </div>
    );
});

export default WalletHeader;
