import React, { useEffect } from 'react';
import { useQueryParams } from '@/hooks';
import { Button } from '@deriv-com/ui';
import useMT5AccountHandler from '../../../../hooks/useMT5AccountHandler';
import { validPassword } from '../../../../utils/password';

type TCreateAccountButtonProps = {
    buttonText: string;
    password: string;
};

const MT5CreateAccountButton = ({ buttonText, password }: TCreateAccountButtonProps) => {
    const { createMT5AccountLoading, doesNotMeetPasswordPolicy, handleSubmit, tradingPlatformPasswordChangeLoading } =
        useMT5AccountHandler();
    const { openModal } = useQueryParams();

    const isLoading = tradingPlatformPasswordChangeLoading || createMT5AccountLoading;
    const isDisabled = !password || isLoading || !validPassword(password);
    useEffect(() => {
        if (doesNotMeetPasswordPolicy) openModal('MT5ChangePasswordModal');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [doesNotMeetPasswordPolicy]);

    return (
        <Button disabled={isDisabled} isLoading={isLoading} onClick={() => handleSubmit(password)}>
            {buttonText}
        </Button>
    );
};

export default MT5CreateAccountButton;
