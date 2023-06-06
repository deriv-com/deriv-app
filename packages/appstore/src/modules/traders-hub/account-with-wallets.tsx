import React from 'react';
import Wallet from 'Components/containers/wallet';
import { observer, useStore } from '@deriv/stores';
import WalletCardsCarousel from 'Components/wallet-cards-carousel';
// import fake_wallets from '../../constants/wallet-mocked-response';
// import { WalletCard } from '@deriv/components';
import { fake_wallet_accounts, sortWalletAccounts } from '@deriv/shared';
import { useWalletAccounts } from '@deriv/hooks';

// TODO: delete it after testing
type TProps = {
    show_test_wallets?: boolean;
};

const AccountWithWallets = observer(({ show_test_wallets = false }: TProps) => {
    const {
        // client: { wallet_accounts },
        ui: { is_mobile },
    } = useStore();

    const wallet_accounts = useWalletAccounts();

    // TODO: We have to create ONE type for desktop and responsive wallet!!!
    // const wallets_to_show: ReturnType<typeof useWalletAccounts>[] = show_test_wallets
    const wallets_to_show: typeof wallet_accounts[] = show_test_wallets
        ? sortWalletAccounts(fake_wallet_accounts)
        : wallet_accounts;

    /*
account_category?: 'trading' | 'wallets';
    account_type?: string;
    balance: string | number;
    currency: string;
    is_disabled: boolean;
    is_virtual: boolean;
    landing_company_shortcode: 'svg' | 'costarica' | 'maltainvest' | 'malta' | 'iom';
    loginid: string;
    icon: string;
    icon_type: 'fiat' | 'crypto' | 'all';
    name: string;
        */

    return (
        <React.Fragment>
            {is_mobile ? (
                <WalletCardsCarousel items={wallets_to_show} />
            ) : (
                wallets_to_show.map((account, index) => (
                    <Wallet
                        key={`${account.account_type} ${account.landing_company_shortcode} ${account.currency} ${index}`}
                        wallet_account={account}
                    />
                ))
            )}
        </React.Fragment>
    );
});

export default AccountWithWallets;
