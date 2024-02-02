import React from 'react';
import { Provider } from '@deriv/library';
import { Button } from '@deriv-com/ui';
import useDxtradeAccountHandler from '../../../../hooks/useDxtradeAccountHandler';
import useMT5AccountHandler from '../../../../hooks/useMT5AccountHandler';
import { validPassword } from '../../../../utils/password';
import { MarketType, PlatformDetails, TTM5FilterLandingCompany } from '../../constants';

type TCreateAccountButtonProps = {
    buttonText: string;
    password: string;
    selectedJurisdiction?: TTM5FilterLandingCompany;
};

const DxtradeAccountButton = ({ buttonText, password }: TCreateAccountButtonProps) => {
    const { createDxtradeAccountLoading, handleSubmit } = useDxtradeAccountHandler();
    const isLoading = createDxtradeAccountLoading;
    const isDisabled = !password || isLoading || !validPassword(password);
    return (
        <Button
            disabled={isDisabled}
            isFullWidth
            isLoading={isLoading}
            onClick={() => handleSubmit(password)}
            size='lg'
        >
            {buttonText}
        </Button>
    );
};

const MT5AccountButton = ({ buttonText, password }: TCreateAccountButtonProps) => {
    const { getCFDState } = Provider.useCFDContext();
    const marketType = getCFDState('marketType') ?? MarketType.ALL;
    const selectedJurisdiction = getCFDState('selectedJurisdiction') as TTM5FilterLandingCompany;
    const { createMT5AccountLoading, handleSubmit, tradingPlatformPasswordChangeLoading } = useMT5AccountHandler({
        marketType,
        selectedJurisdiction,
    });
    const isLoading = tradingPlatformPasswordChangeLoading || createMT5AccountLoading;
    const isDisabled = !password || isLoading || !validPassword(password);

    return (
        <Button
            disabled={isDisabled}
            isFullWidth
            isLoading={isLoading}
            onClick={() => handleSubmit(password)}
            size='lg'
        >
            {buttonText}
        </Button>
    );
};

const CreateAccountButton = ({ buttonText, password }: TCreateAccountButtonProps) => {
    const { getCFDState } = Provider.useCFDContext();
    const platform = getCFDState('platform');

    if (platform === PlatformDetails.dxtrade.platform) {
        return <DxtradeAccountButton buttonText={buttonText} password={password} />;
    }

    return <MT5AccountButton buttonText={buttonText} password={password} />;
};

export default CreateAccountButton;
