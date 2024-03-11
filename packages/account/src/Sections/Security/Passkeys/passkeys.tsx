import React from 'react';
import { Redirect } from 'react-router-dom';
import { Loading } from '@deriv/components';
import { useGetPasskeysList, useRegisterPasskey } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import PasskeysStatusContainer from './components/passkeys-status-container';
import PasskeysList from './components/passkeys-list';
import PasskeyModal from './components/passkey-modal';
import { getModalContent, PASSKEY_STATUS_CODES, TPasskeysStatus } from './passkeys-configs';
import './passkeys.scss';

const Passkeys = observer(() => {
    const { ui, client } = useStore();
    const { is_mobile } = ui;
    const { is_passkey_supported } = client;

    const [passkey_status, setPasskeyStatus] = React.useState<TPasskeysStatus>(PASSKEY_STATUS_CODES.NONE);
    const { passkeys_list, is_passkeys_list_loading, passkeys_list_error, reloadPasskeysList } = useGetPasskeysList();
    const {
        cancelPasskeyRegistration,
        createPasskey,
        clearPasskeyRegistrationError,
        startPasskeyRegistration,
        is_passkey_registration_started,
        is_passkey_registered,
        passkey_registration_error,
    } = useRegisterPasskey();

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

    if (is_passkeys_list_loading) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }
    if (!should_show_passkeys) {
        return <Redirect to={routes.traders_hub} />;
    }

    const error = passkeys_list_error || passkey_registration_error;
    const modal_content = getModalContent({
        error,
        is_passkey_registration_started,
    });

    const onCloseErrorModal = () => {
        if (passkeys_list_error) {
            reloadPasskeysList();
        }
        if (passkey_registration_error) {
            clearPasskeyRegistrationError();
        }
    };
    const onModalButtonClick = () => {
        if (error) {
            onCloseErrorModal();
        } else {
            createPasskey();
        }
    };

    return (
        <div className='passkeys'>
            {passkey_status ? (
                <PasskeysStatusContainer
                    createPasskey={startPasskeyRegistration}
                    passkey_status={passkey_status}
                    setPasskeyStatus={setPasskeyStatus}
                />
            ) : (
                <PasskeysList
                    passkeys_list={passkeys_list || []}
                    onPrimaryButtonClick={startPasskeyRegistration}
                    onSecondaryButtonClick={() => setPasskeyStatus(PASSKEY_STATUS_CODES.LEARN_MORE)}
                />
            )}
            <PasskeyModal
                toggleModal={is_passkey_registration_started ? cancelPasskeyRegistration : undefined}
                has_close_icon={!!modal_content.header}
                header={modal_content.header}
                className='passkeys-modal'
                is_modal_open={!!error || is_passkey_registration_started}
                description={modal_content.description}
                button_text={modal_content.button_text}
                onButtonClick={onModalButtonClick}
            />
        </div>
    );
});

export default Passkeys;
