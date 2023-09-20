import React from 'react';
import { Loading } from '@deriv/components';
import { getPropertyValue } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import LoadErrorMessage from 'Components/load-error-message';
import { useGetTwoFa, useGetSecretKey } from '@deriv/hooks';
import TwoFactorEnabled from './two-factor-enabled';
import TwoFactorDisabled from './two-factor-disabled';

const TwoFactorAuthentication = observer(() => {
    const { client } = useStore();
    const {
        error: error_2fa,
        is_TwoFA_enabled,
        getTwoFA,
        isSuccess: is_success_two_fa,
        isLoading: is_loading_2fa,
    } = useGetTwoFa();
    const {
        error: error_secret,
        data,
        getSecretKey,
        isSuccess: is_success_secret,
        isLoading: is_loading_secret,
    } = useGetSecretKey();
    const { email_address, is_switching, has_enabled_two_fa } = client;
    // const { email_address, is_switching } = client;
    const [is_loading, setLoading] = React.useState(true);
    const [error_message, setErrorMessage] = React.useState('');
    const [secret_key, setSecretKey] = React.useState('');
    const [qr_secret_key, setQrSecretKey] = React.useState('');
    // const [has_enabled_two_fa, setTwoFAStatus] = React.useState(is_TwoFA_enabled);
    // const [x, setX] = React.useState(is_TwoFA_enabled);

    const getDigitStatus = React.useCallback(() => {
        // console.log('has_enabled_two_fa', has_enabled_two_fa);
        // console.log('is_TwoFA_enabled', is_TwoFA_enabled);
        getTwoFA();
    }, [getTwoFA]);

    React.useEffect(() => {
        getDigitStatus();
    }, [getDigitStatus, has_enabled_two_fa]);

    // React.useEffect(() => {
    //     getTwoFA();
    // }, [getTwoFA, has_enabled_two_fa]);

    const generateQrCode = React.useCallback(async () => {
        getSecretKey();
        setLoading(false);
    }, [getSecretKey]);

    React.useEffect(() => {
        if (is_success_two_fa) {
            // console.log('is_TwoFA_enabled is_success_two_fa', is_TwoFA_enabled);
            // setTwoFAStatus(is_TwoFA_enabled);
            if (!is_TwoFA_enabled) {
                generateQrCode();
            }
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_success_two_fa]);

    React.useEffect(() => {
        if (error_2fa) {
            if (typeof error_2fa === 'object' && 'message' in error_2fa) {
                const { message } = error_2fa;
                setErrorMessage(message as string);
            }
        }
    }, [error_2fa]);

    React.useEffect(() => {
        if (is_success_secret) {
            // console.log(data);
            const secret_key_value = getPropertyValue(data, ['account_security', 'totp', 'secret_key']);
            const qr_secret_key_value = `otpauth://totp/${email_address}?secret=${secret_key_value}&issuer=Deriv.com`;
            setSecretKey(secret_key_value);
            setQrSecretKey(qr_secret_key_value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_success_secret]);

    React.useEffect(() => {
        if (error_secret) {
            if (typeof error_secret === 'object' && 'message' in error_secret) {
                const { message } = error_secret;
                setErrorMessage(message as string);
            }
        }
    }, [error_secret]);

    if (is_switching || is_loading || is_loading_2fa)
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (error_message) return <LoadErrorMessage error_message={error_message} />;

    return (
        <section className='two-factor'>
            <div className='two-factor__wrapper'>
                {has_enabled_two_fa ? (
                    <TwoFactorEnabled />
                ) : (
                    <TwoFactorDisabled
                        secret_key={secret_key}
                        qr_secret_key={qr_secret_key}
                        is_loading_secret={is_loading_secret}
                        // setTwoFAStatus={setTwoFAStatus}
                    />
                )}
            </div>
        </section>
    );
});

export default TwoFactorAuthentication;
