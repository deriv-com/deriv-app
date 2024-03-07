import React from 'react';
import { platformAuthenticatorIsAvailable } from '@simplewebauthn/browser';
import { Analytics } from '@deriv-com/analytics';

const useIsPasskeySupported = () => {
    const [is_passkey_supported, setIsPasskeySupported] = React.useState(false);
    const [is_passkey_support_checking, setIsPasskeySupportChecking] = React.useState(true);
    const is_passkeys_enabled = Analytics?.getFeatureValue('web_passkeys', undefined);

    React.useEffect(() => {
        if (is_passkeys_enabled === undefined) return;

        const checkPasskeySupport = async () => {
            try {
                const result = await platformAuthenticatorIsAvailable();
                setIsPasskeySupported(result && !!is_passkeys_enabled);
            } catch (error) {
                /* eslint-disable no-console */
                console.error('Error checking passkey support:', error);
            } finally {
                setIsPasskeySupportChecking(false);
            }
        };
        checkPasskeySupport();
    }, [is_passkeys_enabled]);

    console.log('is_passkey_supported', is_passkey_supported);

    return { is_passkey_supported, is_passkey_support_checking };
};

export default useIsPasskeySupported;
