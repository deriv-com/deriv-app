import React from 'react';
import { WalletText } from '../../../../components';
import { TPlatforms } from '../../../../types';
import { getPlatformType } from './compareAccountsConfig';
import { headerColor, platformLabel } from './constants';
import './CompareAccountsPlatformLabel.scss';

type TCompareAccountsPlatformLabel = {
    platform: TPlatforms.All;
};

const CompareAccountsPlatformLabel = ({ platform }: TCompareAccountsPlatformLabel) => {
    const platformType = getPlatformType(platform);

    return (
        <div
            className={`
            wallets-compare-accounts-platform-label
            wallets-compare-accounts-platform-label--${platformType.toLowerCase()}
            `}
            data-testid='dt_wallets_compare_accounts_platform_label'
        >
            <WalletText align='center' as='p' color={headerColor[platformType]} size='xs' weight='bold'>
                {platformLabel[platformType]}
            </WalletText>
        </div>
    );
};

export default CompareAccountsPlatformLabel;
