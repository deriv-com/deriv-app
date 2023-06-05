import React from 'react';
import Wallet from 'Components/containers/wallet';
import { observer, useStore } from '@deriv/stores';
import { WalletCardsCarousel, WalletCardsCarouselOwn } from 'Components/wallet-cards-carousel/wallet-cards-carousel';
// import fake_wallets from '../../constants/wallet-mocked-response';
// import { WalletCard } from '@deriv/components';
import { fake_wallet_accounts, sortWalletAccounts } from '@deriv/shared';
import { TWalletAccount } from 'Types';

// TODO: delete it after testing
type TProps = {
    show_test_wallets?: boolean;
};

const AccountWithWallets = observer(({ show_test_wallets = false }: TProps) => {
    const {
        client: { wallet_accounts },
        ui: { is_mobile },
    } = useStore();

    // TODO: We have to create ONE type for desktop and responsive wallet!!!
    const wallets_to_show: TWalletAccount[] = show_test_wallets
        ? sortWalletAccounts(fake_wallet_accounts)
        : wallet_accounts;

    return (
        <React.Fragment>
            {is_mobile ? (
                <>
                    <WalletCardsCarouselOwn items={wallets_to_show} />
                    <WalletCardsCarousel items={wallets_to_show} />
                </>
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
