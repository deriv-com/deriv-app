import React from 'react';
import classNames from 'classnames';
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
            className={classNames('wallets-compare-accounts-platform-label', {
                'wallets-compare-accounts-platform-label--ctrader': platformType === 'CTrader',
                'wallets-compare-accounts-platform-label--other-cfds': platformType === 'OtherCFDs',
            })}
        >
            <WalletText align='center' as='p' color={headerColor[platformType]} size='xs' weight='bold'>
                {platformLabel[platformType]}
            </WalletText>
        </div>
    );
};

export default CompareAccountsPlatformLabel;
