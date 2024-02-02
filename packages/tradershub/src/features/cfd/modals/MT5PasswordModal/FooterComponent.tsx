import React from 'react';
import { useMT5AccountsList } from '@deriv/api';
import { Provider } from '@deriv/library';
import useMT5AccountHandler from '../../../../hooks/useMT5AccountHandler';
import { MarketType, PlatformDetails, TTM5FilterLandingCompany } from '../../constants';
import AddAccountButtonsGroup from '../ButtonGroups/AddAccountButtonsGroup';
import CreateAccountButton from '../ButtonGroups/CreateAccountButton';
import SuccessButtonGroup from '../ButtonGroups/SuccessButtonGroup';

type TFooterComponentProps = {
    password: string;
};

const FooterComponent = ({ password }: TFooterComponentProps) => {
    const { data: mt5Accounts } = useMT5AccountsList();
    const { getCFDState } = Provider.useCFDContext();
    const marketType = getCFDState('marketType') ?? MarketType.ALL;
    const platform = getCFDState('platform') ?? PlatformDetails.mt5.platform;
    const selectedJurisdiction = getCFDState('selectedJurisdiction') as TTM5FilterLandingCompany;
    const { isCreateMT5AccountSuccess } = useMT5AccountHandler({
        marketType,
        selectedJurisdiction,
    });
    const hasMT5Account = mt5Accounts?.find(account => account.login);

    if (isCreateMT5AccountSuccess) return <SuccessButtonGroup />;

    if (hasMT5Account) return <AddAccountButtonsGroup password={password} />;

    return (
        <CreateAccountButton
            buttonText={`Create ${PlatformDetails.mt5.title} password`}
            password={password}
            platform={platform}
        />
    );
};
export default FooterComponent;
