import React from 'react';
import { Button } from '@deriv-com/ui';
import useMT5AccountHandler from '../../../../hooks/useMT5AccountHandler';
import { validPassword } from '../../../../utils/password';

type TCreateAccountButtonProps = {
    buttonText: string;
    password: string;
};

const MT5CreateAccountButton = ({ buttonText, password }: TCreateAccountButtonProps) => {
    const { createMT5AccountLoading, handleSubmit, tradingPlatformPasswordChangeLoading } = useMT5AccountHandler();
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

export default MT5CreateAccountButton;
