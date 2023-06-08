import React from 'react';
import { TTradingPlatformAvailableAccount } from 'Components/props.types';
import CFDInstrumentsLabelHighlighted from './cfd-instruments-label-highlighted';
import CFDAccountsDescription from './cfd-accounts-description';
import CFDCompareAccountTitleIcon from './cfd-compare-accounts-title-icon';

type TCFDAccountsCardProps = {
    trading_platforms: TTradingPlatformAvailableAccount;
};

const CFDAccountsCard: React.FC<TCFDAccountsCardProps> = ({ trading_platforms }) => {
    return (
        <div>
            <div className='compare-cfd-account-card-container'>
                <CFDCompareAccountTitleIcon trading_platforms={trading_platforms} />
                <CFDAccountsDescription trading_platforms={trading_platforms} />
                <CFDInstrumentsLabelHighlighted trading_platforms={trading_platforms} />
            </div>
        </div>
    );
};

export default CFDAccountsCard;
