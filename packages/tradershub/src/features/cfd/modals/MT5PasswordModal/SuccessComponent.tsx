import React from 'react';
import { useActiveTradingAccount, useMT5AccountsList } from '@deriv/api';
import { Provider } from '@deriv/library';
import useMT5AccountHandler from '../../../../hooks/useMT5AccountHandler';
import useRegulationFlags from '../../../../hooks/useRegulationFlags';
import {
    Category,
    CFDPlatforms,
    companyNamesAndUrls,
    MarketType,
    MarketTypeDetails,
    PlatformDetails,
    TTM5FilterLandingCompany,
} from '../../constants';
import { CFDSuccess } from '../../screens';
import SuccessButtonGroup from './ButtonGroups/SuccessButtonGroup';

const SuccessComponent = () => {
    const { isEU } = useRegulationFlags();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { data: activeTrading } = useActiveTradingAccount();
    const isDemo = activeTrading?.is_virtual;

    const { getCFDState } = Provider.useCFDContext();
    const platform = getCFDState('platform') ?? CFDPlatforms.MT5;
    const marketType = getCFDState('marketType') ?? MarketType.ALL;
    const selectedJurisdiction = getCFDState('selectedJurisdiction') as TTM5FilterLandingCompany;
    const { isCreateMT5AccountSuccess } = useMT5AccountHandler({
        marketType,
        selectedJurisdiction,
    });

    const marketTypeTitle =
        marketType === MarketType.ALL && Object.keys(PlatformDetails).includes(platform)
            ? PlatformDetails[platform].title
            : MarketTypeDetails(isEU)[marketType].title;

    const landingCompanyName = `(${companyNamesAndUrls?.[selectedJurisdiction]?.shortcode})`;

    const SuccessDescription = isDemo
        ? `Let's practise trading with ${activeTrading?.display_balance} virtual funds.`
        : `Transfer funds from your ${activeTrading?.currency} Wallet to your ${marketTypeTitle} ${landingCompanyName} account to start trading.`;

    const SuccessTitle = `Your ${marketTypeTitle} ${isDemo ? Category.DEMO : landingCompanyName} account is ready`;

    if (!isCreateMT5AccountSuccess) return null;

    return (
        <CFDSuccess
            description={SuccessDescription}
            displayBalance={mt5Accounts?.find(account => account.market_type === marketType)?.display_balance ?? '0.00'}
            landingCompany={selectedJurisdiction}
            marketType={marketType}
            platform={CFDPlatforms.MT5}
            renderButtons={SuccessButtonGroup}
            title={SuccessTitle}
        />
    );
};

export default SuccessComponent;
