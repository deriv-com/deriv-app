import React, { useMemo } from 'react';
import { Category } from '../../constants';
import { CFDSuccess } from '../../screens';

const SuccessComponent = ({
    activeTrading,
    isDemo,
    landingCompanyName,
    marketType,
    marketTypeTitle,
    mt5Accounts,
    renderSuccessButton,
    selectedJurisdiction,
}) => {
    return useMemo(() => {
        const renderSuccessDescription = () => {
            return isDemo
                ? `Let's practise trading with ${activeTrading?.display_balance} virtual funds.`
                : `Transfer funds from your ${activeTrading?.currency} Wallet to your ${marketTypeTitle} ${landingCompanyName} account to start trading.`;
        };

        return (
            <CFDSuccess
                description={renderSuccessDescription()}
                displayBalance={
                    mt5Accounts?.find(account => account.market_type === marketType)?.display_balance ?? '0.00'
                }
                landingCompany={selectedJurisdiction}
                marketType={marketType}
                platform='mt5'
                renderButtons={renderSuccessButton}
                title={`Your ${marketTypeTitle} ${isDemo ? Category.DEMO : landingCompanyName} account is ready`}
            />
        );
    }, [
        isDemo,
        activeTrading?.currency,
        activeTrading?.display_balance,
        marketTypeTitle,
        landingCompanyName,
        mt5Accounts,
        selectedJurisdiction,
        marketType,
        renderSuccessButton,
    ]);
};

export default SuccessComponent;
