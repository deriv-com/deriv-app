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

type TWalletHeader = {
    wallet_account: TWalletAccount;
};

const WalletHeader = observer(({ wallet_account }: TWalletHeader) => {
    const { client, traders_hub } = useStore();
    const { switchAccount, loginid } = client;
    const is_active = wallet_account.is_selected;
    // const [is_loading, setIsLoading] = useState(false);
    const { multipliers_account_status } = traders_hub;

    const wallet_buttons = getWalletHeaderButtons(wallet_account.is_demo);

    const onArrowClickHandler = async () => {
        // setIsLoading(true);
        if (loginid !== wallet_account.loginid) await switchAccount(wallet_account.loginid);
        // setIsLoading(false);
    };

    /** @todo: uncomment this when we have a skeleton loader for wallet header*/
    // useEffect(() => {
    //     if (is_authorize) {
    //         setIsLoading(false);
    //     }
    // }, [is_authorize]);

    return (
        <div className={classNames('wallet-header', { 'wallet-header__demo': wallet_account.is_demo })}>
            <div className='wallet-header__container'>
                <WalletCurrencyCard
                    is_demo={wallet_account.is_demo}
                    currency={wallet_account.currency}
                    gradient_class={wallet_account.gradient_card_class}
                    icon={wallet_account.icon}
                    icon_type={wallet_account.currency_config?.type}
                />
                <div className='wallet-header__description'>
                    <WalletHeaderTitle
                        is_demo={wallet_account.is_demo}
                        currency={wallet_account.currency}
                        landing_company_name={wallet_account.landing_company_name}
                    />
                    <WalletHeaderButtons
                        is_disabled={!!multipliers_account_status}
                        is_open={is_active}
                        buttons={wallet_buttons}
                        wallet_account={wallet_account}
                    />
                </div>
                <div className='wallet-header__balance'>
                    <WalletHeaderBalance balance={wallet_account.balance} currency={wallet_account.currency} />
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
