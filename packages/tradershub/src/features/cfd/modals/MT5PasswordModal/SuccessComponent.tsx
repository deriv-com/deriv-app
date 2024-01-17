import React from 'react';
import { useActiveTradingAccount, useCreateMT5Account, useMT5AccountsList } from '@deriv/api';
import useRegulationFlags from '../../../../hooks/useRegulationFlags';
import { TMarketTypes, TPlatforms } from '../../../../types';
import {
    Category,
    companyNamesAndUrls,
    MarketType,
    MarketTypeDetails,
    PlatformDetails,
    TTM5FilterLandingCompany,
} from '../../constants';
import { CFDSuccess } from '../../screens';
import SuccessButtonGroup from './ButtonGroups/SuccessButtonGroup';

type TSuccessComponentProps = {
    marketType: TMarketTypes.SortedMT5Accounts;
    platform: TPlatforms.All;
    selectedJurisdiction: TTM5FilterLandingCompany;
};

const SuccessComponent = ({ marketType, platform, selectedJurisdiction }: TSuccessComponentProps) => {
    const { isEU } = useRegulationFlags();
    const { isSuccess } = useCreateMT5Account();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { data: activeTrading } = useActiveTradingAccount();
    const isDemo = activeTrading?.is_virtual;

    const marketTypeTitle =
        marketType === MarketType.ALL && Object.keys(PlatformDetails).includes(platform)
            ? PlatformDetails[platform].title
            : MarketTypeDetails(isEU)[marketType].title;

    const landingCompanyName = `(${companyNamesAndUrls?.[selectedJurisdiction]?.shortcode})`;

    // TODO: description is wrong
    const SuccessDescription = isDemo
        ? `Let's practise trading with ${activeTrading?.display_balance} virtual funds.`
        : `Transfer funds from your ${activeTrading?.currency} Wallet to your ${marketTypeTitle} ${landingCompanyName} account to start trading.`;

    if (isSuccess) {
        return (
            <CFDSuccess
                description={SuccessDescription}
                displayBalance={
                    mt5Accounts?.find(account => account.market_type === marketType)?.display_balance ?? '0.00'
                }
                landingCompany={selectedJurisdiction}
                marketType={marketType}
                platform='mt5'
                renderButtons={SuccessButtonGroup}
                title={`Your ${marketTypeTitle} ${isDemo ? Category.DEMO : landingCompanyName} account is ready`}
            />
        );
    }
    return <></>;
};

export default SuccessComponent;
