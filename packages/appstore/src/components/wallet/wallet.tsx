import React from 'react';
import classNames from 'classnames';
import WalletHeader from 'Components/wallet-header';
import WalletContent from 'Components/wallet-content';
import { CSSTransition } from 'react-transition-group';
import { formatMoney } from '@deriv/shared';
import { TCoreStores } from '@deriv/stores/types';
import { TWalletCurrency, TWalletShortcode } from 'Types';
import './wallet.scss';

type TWallet = {
    account: TCoreStores['client']['accounts'][0];
    is_open_wallet?: boolean;
};

const Wallet = React.memo(({ account, is_open_wallet }: TWallet) => {
    const [is_open, setIsOpen] = React.useState(!!is_open_wallet);
    const is_demo = account.is_virtual;
    const shortcode = account.landing_company_shortcode === 'maltainvest' ? 'malta' : account.landing_company_shortcode;

    return (
        <div
            className={classNames('wallet', {
                wallet__demo: is_demo,
            })}
        >
            <WalletHeader
                account_type={is_demo ? 'demo' : 'real'}
                balance={formatMoney(account.currency, account.balance, true)}
                currency={account.currency as TWalletCurrency}
                shortcode={shortcode as TWalletShortcode}
                is_open_wallet={is_open}
                setIsOpen={setIsOpen}
            />
            <CSSTransition appear in={is_open} timeout={250} classNames='wallet__transition' unmountOnExit>
                <WalletContent is_demo={!!is_demo} is_eu={shortcode === 'malta'} account={account} />
            </CSSTransition>
        </div>
    );
});
Wallet.displayName = 'Wallet';
export default Wallet;
