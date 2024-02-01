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
    platform: string;
};

const CreateAccountButton = ({ buttonText, password, platform }: TCreateAccountButtonProps) => {
    const { createDxtradeAccountLoading, handleSubmit: handleSubmitDxtrade } = useDxtradeAccountHandler();
    const { getCFDState } = Provider.useCFDContext();
    const marketType = getCFDState('marketType') ?? MarketType.ALL;
    const selectedJurisdiction = getCFDState('selectedJurisdiction') as TTM5FilterLandingCompany;
    const {
        createMT5AccountLoading,
        handleSubmit: handleSubmitMT5,
        tradingPlatformPasswordChangeLoading,
    } = useMT5AccountHandler({
        marketType,
        selectedJurisdiction,
    });

    const isDxtradePlatform = platform === PlatformDetails.dxtrade.platform;
    const isLoading = isDxtradePlatform
        ? createDxtradeAccountLoading
        : tradingPlatformPasswordChangeLoading || createMT5AccountLoading;
    const isDisabled = !password || isLoading || !validPassword(password);
    const handleSubmit = isDxtradePlatform ? handleSubmitDxtrade : handleSubmitMT5;

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

export default CreateAccountButton;
