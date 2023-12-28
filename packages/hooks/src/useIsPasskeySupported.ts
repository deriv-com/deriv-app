import React from 'react';
import { platformAuthenticatorIsAvailable } from '@simplewebauthn/browser';

const useIsPasskeySupported = () => {
    const [is_passkey_supported, setIsPasskeySupported] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        platformAuthenticatorIsAvailable().then(result => {
            setIsPasskeySupported(result);
            setIsLoading(false);
        });
    });

    return { is_passkey_supported, is_loading };
};

export default useIsPasskeySupported;
