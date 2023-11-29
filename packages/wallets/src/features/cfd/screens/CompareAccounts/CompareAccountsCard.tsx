import React from 'react';
import { WalletText } from '../../../../components';
import { THooks, TPlatforms } from '../../../../types';
import CompareAccountsButton from './CompareAccountsButton';
import CompareAccountsDescription from './CompareAccountsDescription';
import CompareAccountsPlatformLabel from './CompareAccountsPlatformLabel';
import CompareAccountsTitleIcon from './CompareAccountsTitleIcon';
import { CFD_PLATFORMS } from './constants';
import InstrumentsLabelHighlighted from './InstrumentsLabelHighlighted';
import './CompareAccountsCard.scss';

type TCompareAccountsCard = {
    isAccountAdded: boolean;
    isDemo: boolean;
    isEuUser: boolean;
    marketType: THooks.AvailableMT5Accounts['market_type'];
    platform: TPlatforms.All;
    shortCode: THooks.AvailableMT5Accounts['shortcode'];
};

const CompareAccountsCard = ({
    isAccountAdded,
    isDemo,
    isEuUser,
    marketType,
    platform,
    shortCode,
}: TCompareAccountsCard) => {
    return (
        <div className='wallets-compare-accounts-main-container'>
            <div className='wallets-compare-accounts-card-container'>
                <CompareAccountsPlatformLabel platform={platform} />
                {platform === CFD_PLATFORMS.CTRADER && (
                    <div className='compare-cfd-account-card-container__banner'>
                        <WalletText size='xs' weight='bold'>
                            New!
                        </WalletText>
                    </div>
                )}
                <CompareAccountsTitleIcon
                    isDemo={isDemo}
                    isEuUser={isEuUser}
                    marketType={marketType}
                    platform={platform}
                    shortCode={shortCode}
                />
                <CompareAccountsDescription
                    isDemo={isDemo}
                    isEuUser={isEuUser}
                    marketType={marketType}
                    shortCode={shortCode}
                />
                <InstrumentsLabelHighlighted
                    isEuUser={isEuUser}
                    marketType={marketType}
                    platform={platform}
                    shortCode={shortCode}
                />
                {isEuUser && (
                    <div className='compare-cfd-account-card-container__eu-clients'>
                        <WalletText color='red' size='2xs' weight='bold'>
                            *Boom 300 and Crash 300 Index
                        </WalletText>
                    </div>
                )}
                <CompareAccountsButton
                    isAccountAdded={isAccountAdded}
                    isDemo={isDemo}
                    marketType={marketType}
                    platform={platform}
                    shortCode={shortCode}
                />
            </div>
        </div>
    );
};

export default CompareAccountsCard;
