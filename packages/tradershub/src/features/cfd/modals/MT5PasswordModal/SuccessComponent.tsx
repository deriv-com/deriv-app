import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveTradingAccount, useCreateMT5Account, useMT5AccountsList } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button } from '@deriv/quill-design';
import { ButtonGroup } from '../../../../components';
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

const SuccessButton = () => {
    const { hide } = Provider.useModal();
    const { data: activeTrading } = useActiveTradingAccount();
    const isDemo = activeTrading?.is_virtual;
    const history = useHistory();

    if (isDemo) {
        return (
            <Button onClick={hide} size='lg'>
                OK
            </Button>
        );
    }
    return (
        <ButtonGroup className='justify-center w-full'>
            <Button onClick={hide} size='lg' variant='secondary'>
                Maybe later
            </Button>
            <Button
                onClick={() => {
                    hide();
                    history.push('/cashier/transfer');
                }}
                size='lg'
            >
                Transfer funds
            </Button>
        </ButtonGroup>
    );
};

type TSuccessComponentProps = {
    marketType: TMarketTypes.SortedMT5Accounts;
    platform: TPlatforms.All;
    selectedJurisdiction: TTM5FilterLandingCompany;
};

const SuccessComponent = ({ marketType, platform, selectedJurisdiction }: TSuccessComponentProps) => {
    const { isEU } = useRegulationFlags();

    const { isSuccess } = useCreateMT5Account();
    const { data: activeTrading } = useActiveTradingAccount();
    const isDemo = activeTrading?.is_virtual;
    const { data: mt5Accounts } = useMT5AccountsList();

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
                renderButtons={SuccessButton}
                title={`Your ${marketTypeTitle} ${isDemo ? Category.DEMO : landingCompanyName} account is ready`}
            />
        );
    }
    return <></>;
};

export default SuccessComponent;
