import React from 'react';
import { TImageTestID, TWalletsImagesListKey, WalletsImageProps } from './image-types';
import HowItWorks from './how-it-works.svg';
import IntroducingWallets from './introducing-wallets.svg';
import IntroducingWalletsEU from './introducing-wallets-eu.svg';
import ReadyDesktopEuImage from './wallets-ready-desktop-eu.svg';
import ReadyDesktopImage from './wallets-ready-desktop.svg';
import ReadyMobileEuImage from './wallets-ready-mobile-eu.svg';
import ReadyMobileImage from './wallets-ready-mobile.svg';
import TradingAccounts from './trading-accounts.svg';
import TradingAccountsEU from './trading-accounts-eu.svg';
import UpgradeDesktopImage from './wallets-upgrade-desktop.svg';
import UpgradeMobileImage from './wallets-upgrade-mobile.svg';
import EnableWalletsModalDesktop from './enable-wallets-modal-desktop.svg';
import EnableWalletsModalMobile from './enable-wallets-modal-mobile.svg';
import WalletsUpgradeStepOneDesktop from './wallets-upgrade-step-one-desktop.svg';
import WalletsUpgradeStepOneMobile from './wallets-upgrade-step-one-mobile.svg';
import WalletsUpgradeStepTwoDesktop from './wallets-upgrade-step-two-desktop.svg';
import WalletsUpgradeStepTwoMobile from './wallets-upgrade-step-two-mobile.svg';
import WalletsUpgradeUnsuccessfulDesktop from './wallets-upgrade-unsuccessful-desktop.svg';
import WalletsUpgradeUnsuccessfulMobile from './wallets-upgrade-unsuccessful-mobile.svg';

export const WalletsImagesList = {
    enable_wallets_modal_desktop: EnableWalletsModalDesktop,
    enable_wallets_modal_mobile: EnableWalletsModalMobile,
    wallets_upgrade_step_one_desktop: WalletsUpgradeStepOneDesktop,
    wallets_upgrade_step_one_mobile: WalletsUpgradeStepOneMobile,
    wallets_upgrade_step_two_desktop: WalletsUpgradeStepTwoDesktop,
    wallets_upgrade_step_two_mobile: WalletsUpgradeStepTwoMobile,
    wallets_upgrade_unsuccessful_desktop: WalletsUpgradeUnsuccessfulDesktop,
    wallets_upgrade_unsuccessful_mobile: WalletsUpgradeUnsuccessfulMobile,
    upgrade_desktop: UpgradeDesktopImage,
    upgrade_mobile: UpgradeMobileImage,
    how_it_works: HowItWorks,
    introducing_wallets: IntroducingWallets,
    introducing_wallets_eu: IntroducingWalletsEU,
    ready_desktop: ReadyDesktopImage,
    ready_desktop_eu: ReadyDesktopEuImage,
    ready_mobile: ReadyMobileImage,
    ready_mobile_eu: ReadyMobileEuImage,
    trading_accounts: TradingAccounts,
    trading_accounts_eu: TradingAccountsEU,
} as const;

const WalletsImage = ({ image, className, width }: WalletsImageProps<TWalletsImagesListKey>) => {
    const Component = WalletsImagesList[image] as React.ElementType;
    const data_testid: TImageTestID = `dt_${image}`;

    return <Component className={className} style={{ width }} data-testid={data_testid} />;
};

export default WalletsImage;
