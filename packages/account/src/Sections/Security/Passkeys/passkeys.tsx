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

//TODO change the ui with new flow with additional step for creation
const Passkeys = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    const [passkey_status, setPasskeyStatus] = React.useState<TPasskeysStatus>(PASSKEY_STATUS_CODES.NONE);
    const { is_passkey_supported, is_passkey_support_checking } = useIsPasskeySupported();
    const { passkeys_list, is_passkeys_list_loading, passkeys_list_error, reloadPasskeysList } = useGetPasskeysList();
    const { createPasskey, clearPasskeyRegistrationError, is_passkey_registered, passkey_registration_error } =
        useRegisterPasskey();

    const should_show_passkeys = is_passkey_supported && is_mobile;

    React.useEffect(() => {
        if (!passkeys_list?.length && !is_passkey_registered) {
            setPasskeyStatus(PASSKEY_STATUS_CODES.NO_PASSKEY);
        } else if (is_passkey_registered) {
            setPasskeyStatus(PASSKEY_STATUS_CODES.CREATED);
        } else {
            setPasskeyStatus(PASSKEY_STATUS_CODES.NONE);
        }
    }, [is_passkey_registered, passkeys_list]);

    if (is_passkey_support_checking || is_passkeys_list_loading) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }
    if (!should_show_passkeys) {
        return <Redirect to={routes.traders_hub} />;
    }

    const onCloseErrorModal = () => {
        if (passkeys_list_error) {
            reloadPasskeysList();
        }
        if (passkey_registration_error) {
            clearPasskeyRegistrationError();
        }
    };

    const error_message = passkeys_list_error || passkey_registration_error;

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
                is_modal_open={!!error_message}
                description={getErrorContent(error_message).description}
                button_text={getErrorContent(error_message).button_text}
                onButtonClick={onCloseErrorModal}
            />
        </div>
    );
});

export default Passkeys;
