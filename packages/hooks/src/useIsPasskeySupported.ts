import React from 'react';
import { platformAuthenticatorIsAvailable } from '@simplewebauthn/browser';

const useIsPasskeySupported = () => {
    const [is_passkey_supported, setIsPasskeySupported] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const checkPasskeySupport = async () => {
            try {
                const result = await platformAuthenticatorIsAvailable();
                setIsPasskeySupported(result);
            } catch (error) {
                /* eslint-disable no-console */
                console.error('Error checking passkey support:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkPasskeySupport();
    }, []);

    return { is_passkey_supported, is_loading };
};

export default useIsPasskeySupported;
