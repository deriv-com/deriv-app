import React from 'react';
import { platformAuthenticatorIsAvailable } from '@simplewebauthn/browser';

const useIsPasskeySupported = () => {
    const [is_passkey_supported, setIsPasskeySupported] = React.useState(false);
    const [is_passkey_support_checking, setIsPasskeySupportChecking] = React.useState(true);

    React.useEffect(() => {
        const checkPasskeySupport = async () => {
            try {
                const result = await platformAuthenticatorIsAvailable();
                //TODO: add feature flag with growthbook instead of is_passkeys_enabled here
                const is_passkeys_enabled = true;
                setIsPasskeySupported(result && is_passkeys_enabled);
            } catch (error) {
                /* eslint-disable no-console */
                console.error('Error checking passkey support:', error);
            } finally {
                setIsPasskeySupportChecking(false);
            }
        };

        checkPasskeySupport();
    }, []);

    return { is_passkey_supported, is_passkey_support_checking };
};

export default useIsPasskeySupported;
