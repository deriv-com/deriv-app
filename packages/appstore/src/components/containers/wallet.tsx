import React from 'react';
import classNames from 'classnames';
import WalletHeader from 'Components/wallet-header';
import WalletContent from 'Components/wallet-content';
import { CSSTransition } from 'react-transition-group';
import { formatMoney } from '@deriv/shared';
import { TWalletCurrency, TWalletShortcode } from 'Types';
import './wallet.scss';

type TWallet = {
    wallet_account: React.ComponentProps<typeof WalletContent>['wallet_account'];
    active: boolean;
    setActive: (is_open: boolean) => void;
};

const Wallet = React.memo(({ wallet_account, active, setActive }: TWallet) => {
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
                is_open_wallet={active}
                setIsOpen={setActive}
            />
            <CSSTransition appear in={active} timeout={240} classNames='wallet__content-transition' unmountOnExit>
                <WalletContent is_demo={!!is_demo} is_eu={shortcode === 'malta'} wallet_account={wallet_account} />
            </CSSTransition>
        </div>
    );
});
Wallet.displayName = 'Wallet';
export default Wallet;
