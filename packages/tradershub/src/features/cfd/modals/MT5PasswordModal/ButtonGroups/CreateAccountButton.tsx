import React from 'react';
import { useCreateMT5Account, useTradingPlatformPasswordChange } from '@deriv/api';
import { Button } from '@deriv/quill-design';
import { validPassword } from '../../../../../utils/password';
import { useSubmitHandler } from '../useSubmitHandler';

type TProps = {
    password: string;
};

const CreateAccountButton = ({ password }: TProps) => {
    const submitHandler = useSubmitHandler({ password });
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
