import React from 'react';
import { TCompareAccountsCard } from 'Components/props.types';
import CFDInstrumentsLabelHighlighted from './cfd-instruments-label-highlighted';
import CFDCompareAccountsDescription from './cfd-compare-accounts-description';
import CFDCompareAccountsTitleIcon from './cfd-compare-accounts-title-icon';
import CFDCompareAccountsPlatformLabel from './cfd-compare-accounts-platform-label';
import CFDCompareAccountsButton from './cfd-compare-accounts-button';

const CFDCompareAccountsCard = ({ trading_platforms }: TCompareAccountsCard) => {
    return (
        <div className='compare-cfd-account-main-container'>
            <CFDCompareAccountsPlatformLabel trading_platforms={trading_platforms} />
            <div className='compare-cfd-account-card-container'>
                <CFDCompareAccountsTitleIcon trading_platforms={trading_platforms} />
                <CFDCompareAccountsDescription trading_platforms={trading_platforms} />
                <CFDInstrumentsLabelHighlighted trading_platforms={trading_platforms} />
                <CFDCompareAccountsButton trading_platforms={trading_platforms} />
            </div>
        </div>
    );
};

export default CFDCompareAccountsCard;
