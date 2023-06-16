import React from 'react';
import { TCompareAccountsCard } from 'Components/props.types';
import CFDInstrumentsLabelHighlighted from './cfd-instruments-label-highlighted';
import CFDCompareAccountsDescription from './cfd-compare-accounts-description';
import CFDCompareAccountsTitleIcon from './cfd-compare-accounts-title-icon';
import CFDCompareAccountsPlatformLabel from './cfd-compare-accounts-platform-label';
import { Text } from '@deriv/components';
import { CFD_PLATFORMS } from '@deriv/shared';
import CFDCompareAccountsButton from './cfd-compare-accounts-button';

const CFDCompareAccountsCard = ({ trading_platforms }: TCompareAccountsCard) => {
    return (
        <div className='compare-cfd-account-main-container'>
            <div className='compare-cfd-account-card-container'>
                <CFDCompareAccountsPlatformLabel trading_platforms={trading_platforms} />
                {(trading_platforms.platform === CFD_PLATFORMS.DERIVEZ ||
                    trading_platforms.platform === CFD_PLATFORMS.CTRADER) && (
                    <Text className='compare-cfd-account-card-container__banner' weight='bold' size='xs'>
                        New!
                    </Text>
                )}
                <CFDCompareAccountsTitleIcon trading_platforms={trading_platforms} />
                <CFDCompareAccountsDescription trading_platforms={trading_platforms} />
                <CFDInstrumentsLabelHighlighted trading_platforms={trading_platforms} />
                <CFDCompareAccountsButton trading_platforms={trading_platforms} />
            </div>
        </div>
    );
};

export default CFDCompareAccountsCard;
