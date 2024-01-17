import React from 'react';
import { useCreateMT5Account, useMT5AccountsList } from '@deriv/api';
import { TMarketTypes, TPlatforms } from '../../../../types';
import { TTM5FilterLandingCompany } from '../../constants';
import AddAccountButtonsGroup from './AddAccountButtonsGroup';
import CreateAccountButton from './CreateAccountButton';
import TransferFundsButtonsGroup from './TransferFundsButtonsGroup';

type TFooterComponentProps = {
    marketType: TMarketTypes.SortedMT5Accounts;
    password: string;
    platform: TPlatforms.All;
    selectedJurisdiction: TTM5FilterLandingCompany;
};

const FooterComponent = ({ marketType, password, platform, selectedJurisdiction }: TFooterComponentProps) => {
    const { data: mt5Accounts } = useMT5AccountsList();
    const hasMT5Account = mt5Accounts?.find(account => account.login);
    const { isSuccess } = useCreateMT5Account();

    if (isSuccess) return <TransferFundsButtonsGroup />;

    if (hasMT5Account)
        return (
            <AddAccountButtonsGroup
                marketType={marketType}
                password={password}
                platform={platform}
                selectedJurisdiction={selectedJurisdiction}
            />
        );

    return (
        <CreateAccountButton marketType={marketType} password={password} selectedJurisdiction={selectedJurisdiction} />
    );
};
export default FooterComponent;
