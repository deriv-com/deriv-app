import React from 'react';
import { useRegulationFlags } from '@/hooks';
import { useCFDContext } from '@/providers';
import {
    Category,
    companyNamesAndUrls,
    MarketType,
    MarketTypeDetails,
    PlatformDetails,
    TTM5FilterLandingCompany,
} from '@cfd/constants';
import { CFDSuccess } from '@cfd/screens';
import { useActiveTradingAccount, useMT5AccountsList } from '@deriv/api-v2';
import SuccessButtonGroup from '../ButtonGroups/SuccessButtonGroup';

const MT5SuccessModal = () => {
    const { isEU } = useRegulationFlags();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { data: activeTrading } = useActiveTradingAccount();
    const isDemo = activeTrading?.is_virtual;

    const { cfdState } = useCFDContext();

    const { platform, marketType: marketTypeState, selectedJurisdiction } = cfdState;

    const marketType = marketTypeState ?? MarketType.ALL;

    const marketTypeTitle =
        marketType === MarketType.ALL && platform && Object.keys(PlatformDetails).includes(platform)
            ? PlatformDetails[platform].title
            : MarketTypeDetails(isEU)[marketType].title;

    const landingCompanyName = `(${
        companyNamesAndUrls?.[selectedJurisdiction as TTM5FilterLandingCompany]?.shortcode
    })`;

    const SuccessDescription = isDemo
        ? `Congratulations, you have successfully created your ${Category.DEMO} ${PlatformDetails.mt5.title} account. To start trading, transfer funds from your Deriv account into this account.`
        : `Congratulations, you have successfully created your ${Category.REAL} ${PlatformDetails.mt5.title} ${landingCompanyName} ${selectedJurisdiction} account. To start trading, top-up funds from your Deriv account into this account.`;

    const SuccessTitle = `Your ${marketTypeTitle} ${isDemo ? Category.DEMO : landingCompanyName} account is ready`;

    return (
        <CFDSuccess
            description={SuccessDescription}
            displayBalance={mt5Accounts?.find(account => account.market_type === marketType)?.display_balance ?? '0.00'}
            landingCompany={selectedJurisdiction}
            marketType={marketType}
            platform={PlatformDetails.mt5.platform}
            renderButtons={SuccessButtonGroup}
            title={SuccessTitle}
        />
    );
};

export default MT5SuccessModal;
