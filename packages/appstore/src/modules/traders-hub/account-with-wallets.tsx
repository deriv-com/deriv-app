import React from 'react';
import Wallet from 'Components/containers/wallet';
import { observer, useStore } from '@deriv/stores';
import WalletCardsCarousel from 'Components/wallet-cards-carousel';
import { useContentFlag, useWalletList } from '@deriv/hooks';
import { Loading, ButtonToggle } from '@deriv/components';
import { convertWallets } from 'Constants/utils';
import ButtonToggleLoader from 'Components/pre-loader/button-toggle-loader';
import { routes } from '@deriv/shared';
import WalletOptionsAndMultipliersListing from 'Components/wallet-content/wallet-option-multipliers-listing';
import WalletCFDsListing from 'Components/wallet-content/wallet-cfds-listing';

const AccountWithWallets = observer(() => {
    const {
        ui: { is_mobile, is_dark_mode_on },
        client: { is_landing_company_loaded, active_wallet_loginid, setActiveWalletLoginid },
        traders_hub: { selected_platform_type, setTogglePlatformType, is_eu_user },
    } = useStore();

    const { is_eu_demo, is_eu_real } = useContentFlag();
    const eu_title = is_eu_demo || is_eu_real || is_eu_user;

    const { data, isLoading } = useWalletList();

    const platform_toggle_options = [
        { text: 'CFDs', value: 'cfd' },
        { text: eu_title ? 'Multipliers' : 'Options & Multipliers', value: 'options' },
    ];

    const platformTypeChange = (event: {
        target: {
            value: string;
            name: string;
        };
    }) => {
        setTogglePlatformType(event.target.value);
    };

    // TODO: We have to create ONE type for desktop and responsive wallet!!!
    const wallet_accounts = React.useMemo(() => convertWallets(data, is_dark_mode_on), [data, is_dark_mode_on]);

    // In my opinion we have to add 'active_wallet' in client-store, because we use it
    // for desktop wallets, in responsive mode, for wallet modal and we will use it for DTrader header

    const active_wallet_index =
        wallet_accounts.findIndex(item => item?.loginid === active_wallet_loginid) === -1
            ? 0
            : wallet_accounts.findIndex(item => item?.loginid === active_wallet_loginid);

    const desktop_wallets_component = wallet_accounts.map(wallet => {
        const setIsOpenWallet = () =>
            setActiveWalletLoginid(active_wallet_loginid === wallet.loginid ? '' : wallet.loginid);

        return (
            <Wallet
                key={wallet.loginid}
                wallet_account={wallet}
                active={active_wallet_loginid === wallet.loginid}
                setActive={setIsOpenWallet}
            />
        );
    });

    if (isLoading) return <Loading is_fullscreen={false} />;

    return (
        <React.Fragment>
            {is_mobile ? (
                <React.Fragment>
                    <WalletCardsCarousel
                        items={wallet_accounts}
                        setSelectedWallet={setActiveWalletLoginid}
                        active_wallet_index={active_wallet_index}
                    />
                    {is_landing_company_loaded ? (
                        <ButtonToggle
                            buttons_arr={platform_toggle_options}
                            className='traders-hub__button-toggle'
                            has_rounded_button
                            is_traders_hub={window.location.pathname === routes.traders_hub}
                            name='platform_type'
                            onChange={platformTypeChange}
                            value={selected_platform_type}
                        />
                    ) : (
                        <ButtonToggleLoader />
                    )}
                    {selected_platform_type === 'cfd' && (
                        <WalletCFDsListing wallet_account={wallet_accounts[active_wallet_index]} />
                    )}
                    {selected_platform_type === 'options' && (
                        <WalletOptionsAndMultipliersListing wallet_account={wallet_accounts[active_wallet_index]} />
                    )}
                </React.Fragment>
            ) : (
                <React.Fragment>{desktop_wallets_component}</React.Fragment>
            )}
        </React.Fragment>
    );
});

export default AccountWithWallets;
