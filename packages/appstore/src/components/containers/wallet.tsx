import React from 'react';
import classNames from 'classnames';
import WalletHeader from 'Components/wallet-header';
import WalletContent from 'Components/wallet-content';
import { CSSTransition } from 'react-transition-group';
import { formatMoney } from '@deriv/shared';
// import { TCoreStores } from '@deriv/stores/types';
import { TWalletAccount, TWalletCurrency, TWalletShortcode } from 'Types';
import './wallet.scss';

type TWallet = {
    // wallet_account: TCoreStores['client']['accounts'][0];
    wallet_account: TWalletAccount;
    is_open_wallet?: boolean;
};

const Wallet = React.memo(({ wallet_account, is_open_wallet }: TWallet) => {
    const [is_open, setIsOpen] = React.useState(!!is_open_wallet);
    const is_demo = wallet_account.is_virtual;
    const shortcode =
        wallet_account.landing_company_shortcode === 'maltainvest' ? 'malta' : wallet_account.landing_company_shortcode;

    return (
        <div
            className={classNames('wallet', {
                wallet__demo: is_demo,
            })}
        >
            <WalletHeader
                account_type={is_demo ? 'demo' : 'real'}
                balance={formatMoney(wallet_account.currency, wallet_account.balance, true)}
                currency={wallet_account.currency as TWalletCurrency}
                shortcode={shortcode as TWalletShortcode}
                is_open_wallet={is_open}
                setIsOpen={setIsOpen}
                icon_type={wallet_account.icon_type}
                icon={wallet_account.icon}
            />
            <CSSTransition appear in={is_open} timeout={240} classNames='wallet__content-transition' unmountOnExit>
                <WalletContent is_demo={!!is_demo} is_eu={shortcode === 'malta'} wallet_account={wallet_account} />
            </CSSTransition>
        </div>
    );
});
Wallet.displayName = 'Wallet';
export default Wallet;
