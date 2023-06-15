import React, { useEffect, useState } from 'react';
import { Icon } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import classNames from 'classnames';
import WalletCurrencyCard from './wallet-currency-card';
import WalletHeaderButtons from './wallet-header-buttons';
import WalletHeaderTitle from './wallet-header-title';
import WalletHeaderBalance from './wallet-header-balance';
import { TWalletAccount } from 'Types';
import { getWalletHeaderButtons } from 'Constants/utils';
import './wallet-header.scss';

type TWalletHeader = {
    data: TWalletAccount;
};

const WalletHeader = observer(({ data }: TWalletHeader) => {
    const { client, traders_hub } = useStore();
    const { switchAccount, loginid, is_authorize } = client;
    const is_active = loginid === data.loginid;
    const [is_loading, setIsLoading] = useState(false);
    const { multipliers_account_status } = traders_hub;

    const wallet_btns = getWalletHeaderButtons(data.is_demo);

    const onArrowClickHandler = async () => {
        setIsLoading(true);
        if (loginid !== data.loginid) await switchAccount(data.loginid);
        setIsLoading(false);
    };

    useEffect(() => {
        if (is_authorize) {
            setIsLoading(false);
        }
    }, [is_authorize]);

    return (
        <div className={classNames('wallet-header', { 'wallet-header__demo': data.is_demo })}>
            <div className='wallet-header__container'>
                <WalletCurrencyCard is_demo={data.is_demo} currency={data.currency} />
                <div className='wallet-header__description'>
                    <WalletHeaderTitle
                        is_demo={data.is_demo}
                        currency={data.currency}
                        landing_company_name={data.landing_company_name}
                    />
                    <WalletHeaderButtons
                        is_disabled={!!multipliers_account_status}
                        is_open={is_active}
                        btns={wallet_btns}
                    />
                </div>
                <div className='wallet-header__balance'>
                    <WalletHeaderBalance balance={data.balance} currency={data.currency} />
                    <Icon
                        data_testid='dt_arrow'
                        onClick={onArrowClickHandler}
                        icon='IcChevronDownBold'
                        className={classNames('wallet-header__balance-arrow-icon', {
                            'wallet-header__balance-arrow-icon-active': is_active,
                        })}
                    />
                    {is_loading && <p>loading</p>}
                </div>
            </div>
        </div>
    );
});
export default WalletHeader;
