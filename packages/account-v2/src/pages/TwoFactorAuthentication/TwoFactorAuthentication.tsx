import React from 'react';
import { useIsTwoFactorAuthenticationEnabled } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { TwoFactorAuthenticationDisabled } from './TwoFactorAuthenticationDisabled';
import { TwoFactorAuthenticationEnabled } from './TwoFactorAuthenticationEnabled';

export const TwoFactorAuthentication = () => {
    const { data: isTwoFactorAuthenticationEnabled, isLoading: isStatusLoading } =
        useIsTwoFactorAuthenticationEnabled();

    if (isStatusLoading) return <Loader isFullScreen={true} />;

    return (
        <>
            {isTwoFactorAuthenticationEnabled ? (
                <TwoFactorAuthenticationEnabled />
            ) : (
                <TwoFactorAuthenticationDisabled />
            )}
        </>
    );
};
