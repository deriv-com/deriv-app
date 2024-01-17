import React from 'react';
import { useCreateMT5Account, useTradingPlatformPasswordChange } from '@deriv/api';
import { Button } from '@deriv/quill-design';
import { TMarketTypes } from '../../../../types';
import { validPassword } from '../../../../utils/password';
import { TTM5FilterLandingCompany } from '../../constants';
import { useSubmitHandler } from './useSubmitHandler';

type TCreateAccountButtonProps = {
    marketType: TMarketTypes.SortedMT5Accounts;
    password: string;
    selectedJurisdiction: TTM5FilterLandingCompany;
};

const CreateAccountButton = ({ marketType, password, selectedJurisdiction }: TCreateAccountButtonProps) => {
    const submitHandler = useSubmitHandler({ marketType, password, selectedJurisdiction });
    const { isLoading: createMT5AccountLoading } = useCreateMT5Account();
    const { isLoading: tradingPlatformPasswordChangeLoading } = useTradingPlatformPasswordChange();

    return (
        <Button
            disabled={
                !password || createMT5AccountLoading || tradingPlatformPasswordChangeLoading || !validPassword(password)
            }
            fullWidth
            isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
            onClick={() => submitHandler}
            size='lg'
        >
            Create Deriv MT5 password
        </Button>
    );
};

export default CreateAccountButton;
