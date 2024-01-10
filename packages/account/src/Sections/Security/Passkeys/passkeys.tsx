import React from 'react';
import { Redirect } from 'react-router-dom';
import { Loading } from '@deriv/components';
import { useGetPasskeysList, useIsPasskeySupported, useRegisterPasskey } from '@deriv/hooks';
import { PlatformContext, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import NoPasskeysSet from './no-passkeys-set';
import './passkeys.scss';
import PasskeysStatus from 'Sections/Security/Passkeys/passkeys-status';
import { Localize } from '@deriv/translations';
import PasskeysList from 'Sections/Security/Passkeys/passkeys-list';

const mock_passkeys_list = [
    {
        id: 1,
        name: 'Passkey Name 1',
        last_used_at: 1702365923,
        created_at: 1702365923,
        stored_on: 'no info',
    },
    {
        id: 2,
        name: 'Passkey Name 2',
        last_used_at: 1702365923,
        created_at: 1702365923,
        stored_on: 'no info',
    },
    {
        id: 3,
        name: 'Passkey Name 2',
        last_used_at: 1702365923,
        created_at: 1702365923,
        stored_on: 'no info',
    },
];

const Passkeys = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { is_passkeys_enabled } = React.useContext(PlatformContext);

    const [should_show_status, setShouldShowStatus] = React.useState(false);

    const { is_passkey_supported, is_loading: is_passkey_support_checked } = useIsPasskeySupported();
    const should_show_passkeys = is_passkeys_enabled && is_passkey_supported && is_mobile;

    const { data: passkeys_list, isLoading: is_passkeys_list_loading } = useGetPasskeysList();
    const { createPasskey, is_registration_in_progress, is_passkey_registered } = useRegisterPasskey();

    React.useEffect(() => {
        if (is_passkey_registered) {
            setShouldShowStatus(true);
        }
    }, [is_passkey_registered]);

    if (is_passkey_support_checked || is_passkeys_list_loading) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }

    if (!should_show_passkeys) {
        return <Redirect to={routes.traders_hub} />;
    }

    //TODO modify the logic to show different statuses
    if (should_show_status) {
        return (
            <div className='passkeys'>
                <PasskeysStatus
                    icon='IcSuccessPasskey'
                    title={<Localize i18n_default_text='Passkey created successfully!' />}
                    button_text={<Localize i18n_default_text='Continue' />}
                    onButtonClick={() => {
                        setShouldShowStatus(false);
                    }}
                    description={
                        <Localize i18n_default_text='Your account is now set up with a passkey,allowing you to easily log in and manage it in your account settings.' />
                    }
                />
            </div>
        );
    }

    return (
        <div className='passkeys'>
            {!passkeys_list?.length ? (
                <NoPasskeysSet onButtonClick={createPasskey} />
            ) : (
                <PasskeysList
                    passkeys_list={mock_passkeys_list}
                    onButtonClick={createPasskey}
                    is_creation_available={true}
                />
            )}
        </div>
    );
});

export default Passkeys;
