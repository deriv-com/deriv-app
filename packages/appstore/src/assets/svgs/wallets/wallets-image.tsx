import React from 'react';
import { TImageTestID, TWalletsImagesListKey, WalletsImageProps } from './image-types';
import WalletsUpgradeCoinsHorizontal from './wallets-upgrade-coins-horizontal.svg';
import WalletsUpgradeCoins from './wallets-upgrade-coins.svg';

import WalletsUpgradeStepOne from './wallets-upgrade-step-one.svg';
import WalletsUpgradeStepTwo from './wallets-upgrade-step-two.svg';

import WalletsUpgradeUnsuccessful from './wallets-upgrade-unsuccessful.svg';

export const WalletsImagesList = {
    wallets_upgrade_coins: WalletsUpgradeCoins,
    wallets_upgrade_coins_horizontal: WalletsUpgradeCoinsHorizontal,
    wallets_upgrade_step_one: WalletsUpgradeStepOne,
    wallets_upgrade_step_two: WalletsUpgradeStepTwo,
    wallets_upgrade_unsuccessful: WalletsUpgradeUnsuccessful,
} as const;

const WalletsImage = ({ image, className, width }: WalletsImageProps<TWalletsImagesListKey>) => {
    const Component = WalletsImagesList[image] as React.ElementType;
    const data_testid: TImageTestID = `dt_${image}`;

    return <Component className={className} style={{ width }} data-testid={data_testid} />;
};

export default WalletsImage;
