import React from 'react';
import Wallet from 'Components/containers/wallet';
import { observer, useStore } from '@deriv/stores';
import WalletCardsCarousel from 'Components/wallet-cards-carousel';
import { useContentFlag, useWalletsList } from '@deriv/hooks';
import { ButtonToggle } from '@deriv/components';
import ButtonToggleLoader from 'Components/pre-loader/button-toggle-loader';
import { routes } from '@deriv/shared';
import WalletOptionsAndMultipliersListing from 'Components/wallet-content/wallet-option-multipliers-listing';
import WalletCFDsListing from 'Components/wallet-content/wallet-cfds-listing';
import AddMoreWallets from 'Components/add-more-wallets';

const AccountWithWallets = observer(() => {
    const {
        ui: { is_mobile },
        client: { is_landing_company_loaded },
        traders_hub: { selected_platform_type, setTogglePlatformType, is_eu_user },
    } = useStore();

    const { is_eu_demo, is_eu_real } = useContentFlag();
    const eu_title = is_eu_demo || is_eu_real || is_eu_user;

    const { data: wallet_accounts } = useWalletsList();

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

    const desktopWalletsComponent = React.useMemo(
        () =>
            wallet_accounts?.map(wallet => {
                // TODO: We have to create hook for 'switchAccount' with useFetch() to use cache in the future
                return <Wallet key={wallet.loginid} wallet_account={wallet} />;
            }),
        [wallet_accounts]
    );

    React.useEffect(() => {
        setTogglePlatformType('cfd');
    }, [setTogglePlatformType]);

    return (
        <React.Fragment>
            {is_mobile ? (
                <React.Fragment>
                    <WalletCardsCarousel items={wallet_accounts} />
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
                    {selected_platform_type === 'cfd' && <WalletCFDsListing />}
                    {selected_platform_type === 'options' && <WalletOptionsAndMultipliersListing />}
                </React.Fragment>
            ) : (
                <React.Fragment>{desktopWalletsComponent}</React.Fragment>
            )}
            <AddMoreWallets />
        </React.Fragment>
    );
});

export default AccountWithWallets;
