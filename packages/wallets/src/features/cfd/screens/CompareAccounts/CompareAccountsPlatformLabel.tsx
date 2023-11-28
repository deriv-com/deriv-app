import React from 'react';
import classNames from 'classnames';
import { WalletText } from '../../../../components';
import { getPlatformType } from './compareAccountsConfig';
import { CFD_PLATFORMS, headerColor, platformLabel } from './constants';
import './CompareAccountsPlatformLabel.scss';

type TCompareAccountsPlatformLabel = {
    platform: typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS];
};

const CompareAccountsPlatformLabel = ({ platform }: TCompareAccountsPlatformLabel) => {
    const platformType = getPlatformType(platform);

    return (
        <div
            className={classNames('wallets-compare-accounts-platform-label', {
                'wallet-compare-accounts-platform-label--other-cfds': platformType === 'OtherCFDs',
            })}
        >
            <WalletText align='center' as='p' color={headerColor[platformType]} size='xs' weight='bold'>
                {platformLabel[platformType]}
            </WalletText>
        </div>
    );
};

export default CompareAccountsPlatformLabel;
