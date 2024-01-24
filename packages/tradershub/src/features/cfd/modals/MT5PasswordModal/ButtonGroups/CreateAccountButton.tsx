import React from 'react';
import { Provider } from '@deriv/library';
import { Button } from '@deriv/quill-design';
import { validPassword } from '../../../../../utils/password';
import { useSubmitHandler } from '../useSubmitHandler';

type TProps = {
    password: string;
};

const CreateAccountButton = ({ password }: TProps) => {
    const submitHandler = useSubmitHandler({ password });
    const { getCFDState } = Provider.useCFDContext();
    const createMT5AccountLoading = getCFDState('createMT5AccountLoading');
    const tradingPlatformPasswordChangeLoading = getCFDState('tradingPlatformPasswordChangeLoading');

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
