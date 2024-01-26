import React from 'react';
import { Redirect } from 'react-router-dom';
import { Loading } from '@deriv/components';
import { useGetPasskeysList, useIsPasskeySupported, useRegisterPasskey } from '@deriv/hooks';
import { PlatformContext, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import PasskeysStatusContainer from './components/passkeys-status-container';
import PasskeysList from './components/passkeys-list';
import PasskeyModal from './components/passkey-modal';
import { PASSKEY_STATUS_CODES, TPasskeysStatus } from './passkeys-configs';
import './passkeys.scss';

//TODO remove mock passkeys
const mock_passkeys_list = [
    {
        id: 1,
        name: 'New Passkey 1',
        last_used: 1702365923000,
        created_at: 1702365923000,
        stored_on: '',
        icon: 'IcFingerprint',
    },
    {
        id: 2,
        name: 'New Passkey 2',
        last_used: 1702365923000,
        created_at: 1702365923000,
        stored_on: '',
        icon: 'IcPattern',
    },
    {
        id: 3,
        name: 'New Passkey 3',
        last_used: 1702365923000,
        created_at: 1702365923000,
        stored_on: '',
        icon: 'IcPasscode',
    },
    {
        id: 4,
        name: 'New Passkey 4',
        last_used: 1702365923000,
        created_at: 1702365923000,
        stored_on: '',
        icon: 'IcFaceid',
    },
];

const Passkeys = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { is_passkeys_enabled } = React.useContext(PlatformContext);

    const [passkey_status, setPasskeyStatus] = React.useState<TPasskeysStatus>(PASSKEY_STATUS_CODES.NONE);
    const { is_passkey_supported, is_loading: is_passkey_support_checked } = useIsPasskeySupported();
    const {
        data: passkeys_list,
        isLoading: is_passkeys_list_loading,
        error: passkeys_list_error,
    } = useGetPasskeysList();
    const { createPasskey, is_passkey_registered, registration_error } = useRegisterPasskey();

    const should_show_passkeys = is_passkeys_enabled && is_passkey_supported && is_mobile;

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
                    onSecondaryButtonClick={() => setPasskeyStatus(PASSKEY_STATUS_CODES.LEARN_MORE)}
                    onPrimaryButtonClick={createPasskey}
                />
            )}

            <PasskeyModal
                title={<Localize i18n_default_text='Passkey error' />}
                description={
                    (passkeys_list_error && String(passkeys_list_error)) ||
                    (registration_error && String(registration_error)) || (
                        <Localize i18n_default_text='Some error occured' />
                    )
                }
                button_text={<Localize i18n_default_text='Refresh' />}
                is_modal_open={!!passkeys_list_error || !!registration_error}
                onButtonClick={() => {
                    location.reload();
                }}
            />
        </div>
    );
});

export default Passkeys;
