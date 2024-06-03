import React from 'react';
import { startAuthentication } from '@simplewebauthn/browser';
import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';
import { useInvalidateQuery } from '@deriv/api';
import { mobileOSDetect, WS } from '@deriv/shared';
import { Analytics } from '@deriv-com/analytics';

type TError = { code?: string; name?: string; message: string };

const passkeyErrorEventTrack = (error: TError) => {
    // TODO: remove ts ignore after adding types to Analytics
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Analytics.trackEvent('ce_passkey_account_settings_form', {
        action: 'error',
        form_name: 'ce_passkey_account_settings_form',
        operating_system: mobileOSDetect(),
        error_message: error?.message,
    });
};

const useRemovePasskey = () => {
    const invalidate = useInvalidateQuery();

    const [is_passkey_removed, setIsPasskeyRemoved] = React.useState(false);
    const [passkey_removing_error, setPasskeyRemovingError] = React.useState<TError | null>(null);
    const [public_key, setPublicKey] = React.useState<null | PublicKeyCredentialCreationOptionsJSON>(null);

    // const startPasskeyRegistration = async () => {
    //     try {
    //         const passkeys_register_options_response = await WS.send({ passkeys_register_options: 1 });
    //         const public_key = passkeys_register_options_response?.passkeys_register_options?.publicKey;
    //         setPublicKey(public_key);
    //     } catch (e) {
    //         setPasskeyRegistrationError(e as TError);
    //         passkeyErrorEventTrack(e as TError);
    //     }
    // };

    const removePasskey = async (id: string) => {
        try {
            const passkey_options_response = await WS.send({
                passkeys_options: 1,
            });
            const public_key = passkey_options_response.passkeys_options.publicKey;
        } catch (e) {
            // console.log();
        }

        // try {
        //     if (public_key) {
        //         setIsPasskeyRegistered(false);
        //         const authenticator_response = await startRegistration(public_key);
        //         const passkeys_register_response = await WS.send({
        //             passkeys_register: 1,
        //             publicKeyCredential: authenticator_response,
        //         });
        //         if (passkeys_register_response?.passkeys_register?.properties?.name) {
        //             invalidate('passkeys_list');
        //             setIsPasskeyRegistered(true);
        //         } else if (passkeys_register_response?.error) {
        //             setPasskeyRegistrationError(passkeys_register_response?.error);
        //             passkeyErrorEventTrack(passkeys_register_response?.error);
        //         }
        //     }
        // } catch (e) {
        //     if (!excluded_error_names.some(name => name === (e as TError).name)) {
        //         setPasskeyRegistrationError(e as TError);
        //         passkeyErrorEventTrack(e as TError);
        //     }
        // } finally {
        //     setPublicKey(null);
        // }
    };

    return {
        removePasskey,
    };
};

export default useRemovePasskey;
