import React from 'react';
import { Text } from '@deriv/components';
import { CFD_PLATFORMS } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { TCompareAccountsCard } from 'Components/props.types';
import CFDInstrumentsLabelHighlighted from './cfd-instruments-label-highlighted';
import CFDCompareAccountsDescription from './cfd-compare-accounts-description';
import CFDCompareAccountsTitleIcon from './cfd-compare-accounts-title-icon';
import CFDCompareAccountsPlatformLabel from './cfd-compare-accounts-platform-label';
import CFDCompareAccountsButton from './cfd-compare-accounts-button';

const CFDCompareAccountsCard = ({ trading_platforms, is_eu_user, is_demo }: TCompareAccountsCard) => {
    return (
        <div className='compare-cfd-account-main-container'>
            <div className='compare-cfd-account-card-container'>
                <CFDCompareAccountsPlatformLabel trading_platforms={trading_platforms} />
                {(trading_platforms.platform === CFD_PLATFORMS.DERIVEZ ||
                    trading_platforms.platform === CFD_PLATFORMS.CTRADER) && (
                    <Text className='compare-cfd-account-card-container__banner' weight='bold' size='xs'>
                        <Localize i18n_default_text='New!' />
                    </Text>
                )}
                <CFDCompareAccountsTitleIcon
                    trading_platforms={trading_platforms}
                    is_eu_user={is_eu_user}
                    is_demo={is_demo}
                />
                <CFDCompareAccountsDescription trading_platforms={trading_platforms} is_demo={is_demo} />
                <CFDInstrumentsLabelHighlighted trading_platforms={trading_platforms} is_demo={is_demo} />
                {is_eu_user && (
                    <div className='compare-cfd-account-card-container__eu-clients'>
                        <Text color='red' size='xxs' weight='bold'>
                            {localize('*Boom 300 and Crash 300 Index')}
                        </Text>
                    </div>
                )}
                <CFDCompareAccountsButton trading_platforms={trading_platforms} is_demo={is_demo} />
            </div>
        </div>
    );
};

export default CFDCompareAccountsCard;
