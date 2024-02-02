import React from 'react';
import { Redirect } from 'react-router-dom';
import { Loading } from '@deriv/components';
import { useGetPasskeysList, useIsPasskeySupported, useRegisterPasskey } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import PasskeysStatusContainer from './components/passkeys-status-container';
import PasskeysList from './components/passkeys-list';
import PasskeyModal from './components/passkey-modal';
import { getErrorContent, PASSKEY_STATUS_CODES, TPasskeysStatus } from './passkeys-configs';
import './passkeys.scss';

const Passkeys = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    //TODO: add feature flag with growthbook
    const is_passkeys_enabled = true;

    const [passkey_status, setPasskeyStatus] = React.useState<TPasskeysStatus>(PASSKEY_STATUS_CODES.NONE);
    const { is_passkey_supported, is_loading: is_passkey_support_checked } = useIsPasskeySupported();
    const [passkey_error_modal_open, setPasskeyErrorModalOpen] = React.useState(false);
    const {
        data: passkeys_list,
        isLoading: is_passkeys_list_loading,
        error: passkeys_list_error,
    } = useGetPasskeysList();
    const { createPasskey, is_passkey_registered, registration_error } = useRegisterPasskey();

    const should_show_passkeys = is_passkeys_enabled && is_passkey_supported && is_mobile;

    React.useEffect(() => {
        if (passkeys_list_error || registration_error) {
            setPasskeyErrorModalOpen(true);
        }
    }, [passkeys_list_error, registration_error]);

    React.useEffect(() => {
        if (!passkeys_list?.length && !is_passkey_registered) {
            setPasskeyStatus(PASSKEY_STATUS_CODES.NO_PASSKEY);
        } else if (is_passkey_registered) {
            setPasskeyStatus(PASSKEY_STATUS_CODES.CREATED);
        } else {
            setPasskeyStatus(PASSKEY_STATUS_CODES.NONE);
        }
    }, [is_passkey_registered, passkeys_list]);

    if (is_passkey_support_checked || is_passkeys_list_loading) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }
    if (!should_show_passkeys) {
        return <Redirect to={routes.traders_hub} />;
    }

    const getErrorText = () => {
        if (passkeys_list_error) {
            return passkeys_list_error.error.message ? passkeys_list_error.error.message : String(passkeys_list_error);
        }
        if (registration_error) {
            if (typeof registration_error === 'string') return registration_error;
            return registration_error.error.message ? registration_error?.error?.message : String(registration_error);
        }
        return null;
    };

    //TODO consider different error messages with title and descriptions
    return (
        <div className='passkeys'>
            {passkey_status ? (
                <PasskeysStatusContainer
                    createPasskey={createPasskey}
                    passkey_status={passkey_status}
                    setPasskeyStatus={setPasskeyStatus}
                />
            ) : (
                <PasskeysList
                    passkeys_list={passkeys_list || []}
                    onPrimaryButtonClick={createPasskey}
                    onSecondaryButtonClick={() => setPasskeyStatus(PASSKEY_STATUS_CODES.LEARN_MORE)}
                />
            )}

            <PasskeyModal
                className='passkeys-modal__error'
                is_modal_open={passkey_error_modal_open}
                title={getErrorContent(getErrorText()).title}
                description={getErrorContent(getErrorText()).description}
                button_text={getErrorContent(getErrorText()).button_text}
                onButtonClick={() => setPasskeyErrorModalOpen(false)}
            />
        </div>
    );
});

export default Passkeys;
