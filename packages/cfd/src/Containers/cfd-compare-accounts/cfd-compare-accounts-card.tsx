import React from 'react';
import { TModifiedTradingPlatformAvailableAccount } from 'Components/props.types';
import CFDInstrumentsLabelHighlighted from './cfd-instruments-label-highlighted';
import CFDCompareAccountsDescription from './cfd-compare-accounts-description';
import CFDCompareAccountsTitleIcon from './cfd-compare-accounts-title-icon';
import CFDCompareAccountsPlatformLabel from './cfd-compare-accounts-platform-label';

type TCFDCompareAccountsCardProps = {
    trading_platforms: TModifiedTradingPlatformAvailableAccount;
};

const CFDCompareAccountsCard = ({ trading_platforms }: TCFDCompareAccountsCardProps) => {
    return (
        <div className='compare-cfd-account-main-container'>
            <CFDCompareAccountsPlatformLabel trading_platforms={trading_platforms} />
            <div className='compare-cfd-account-card-container'>
                <CFDCompareAccountsTitleIcon trading_platforms={trading_platforms} />
                <CFDCompareAccountsDescription trading_platforms={trading_platforms} />
                <CFDInstrumentsLabelHighlighted trading_platforms={trading_platforms} />
            </div>
        </div>
    );
};

export default CFDCompareAccountsCard;
