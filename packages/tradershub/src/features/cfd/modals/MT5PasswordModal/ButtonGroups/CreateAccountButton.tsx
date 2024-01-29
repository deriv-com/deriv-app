import React from 'react';
import { Provider } from '@deriv/library';
import { Button } from '@deriv/quill-design';
import useMT5AccountHandler from '../../../../../hooks/useMT5AccountHandler';
import { validPassword } from '../../../../../utils/password';
import { MarketType, TTM5FilterLandingCompany } from '../../../constants';

type TProps = {
    password: string;
};

const CreateAccountButton = ({ password }: TProps) => {
    const { getCFDState } = Provider.useCFDContext();
    const marketType = getCFDState('marketType') ?? MarketType.ALL;
    const selectedJurisdiction = getCFDState('selectedJurisdiction') as TTM5FilterLandingCompany;
    const { createMT5AccountLoading, handleSubmit, tradingPlatformPasswordChangeLoading } = useMT5AccountHandler({
        marketType,
        selectedJurisdiction,
    });

    return (
        <Button
            disabled={
                !password || createMT5AccountLoading || tradingPlatformPasswordChangeLoading || !validPassword(password)
            }
            fullWidth
            isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
            onClick={() => handleSubmit(password)}
            size='lg'
        >
            Create Deriv MT5 password
        </Button>
    );
};

export default CreateAccountButton;
