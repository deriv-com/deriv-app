import React from 'react';
import { Button } from '@deriv/quill-design';
import useMT5AccountHandler from '../../../../../hooks/useMT5AccountHandler';
import { validPassword } from '../../../../../utils/password';

type TCreateAccountButtonProps = {
    buttonText: string;
    password: string;
};

const CreateAccountButton = ({ buttonText, password }: TCreateAccountButtonProps) => {
    const { createMT5AccountLoading, handleSubmit, tradingPlatformPasswordChangeLoading } = useMT5AccountHandler();

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
            {buttonText}
        </Button>
    );
};

export default CreateAccountButton;
