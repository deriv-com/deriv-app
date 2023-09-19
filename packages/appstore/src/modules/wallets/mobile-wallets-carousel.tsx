import React from 'react';
import { ButtonToggle } from '@deriv/components';
import { useActiveWallet, useContentFlag } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import ButtonToggleLoader from 'Components/pre-loader/button-toggle-loader';
import WalletCardsCarousel from 'Components/wallet-cards-carousel';
import WalletCFDsListing from 'Components/wallet-content/wallet-cfds-listing';
import WalletOptionsAndMultipliersListing from 'Components/wallet-content/wallet-option-multipliers-listing';
import classNames from 'classnames';

const MobileWalletsCarousel = observer(() => {
    const { client, traders_hub } = useStore();
    const { is_landing_company_loaded } = client;
    const { selected_platform_type, setTogglePlatformType, is_eu_user } = traders_hub;
    const { is_eu_demo, is_eu_real } = useContentFlag();
    const eu_title = is_eu_demo || is_eu_real || is_eu_user;
    const active_wallet = useActiveWallet();

    const platform_toggle_options = [
        { text: 'CFDs', value: 'cfd' },
        { text: eu_title ? 'Multipliers' : 'Options & Multipliers', value: 'options' },
    ];

    const platformTypeChange = (event: { target: { value: string; name: string } }) => {
        setTogglePlatformType(event.target.value);
    };

    return (
        <>
            <WalletCardsCarousel />
            <div
                className={classNames('wallet-carousel-content-container', {
                    'wallet-carousel-content-container-demo': active_wallet?.is_demo,
                })}
            >
                {is_landing_company_loaded ? (
                    <ButtonToggle
                        buttons_arr={platform_toggle_options}
                        className='traders-hub__button-toggle'
                        has_rounded_button
                        is_traders_hub
                        name='platform_type'
                        onChange={platformTypeChange}
                        value={selected_platform_type}
                    />
                ) : (
                    <ButtonToggleLoader />
                )}
                {selected_platform_type === 'cfd' && <WalletCFDsListing />}
                {selected_platform_type === 'options' && <WalletOptionsAndMultipliersListing />}
            </div>
        </>
    );
});

export default MobileWalletsCarousel;
