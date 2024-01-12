import React from 'react';
import { Redirect } from 'react-router-dom';
import { Loading } from '@deriv/components';
import { useGetPasskeysList, useIsPasskeySupported, useRegisterPasskey } from '@deriv/hooks';
import { PlatformContext, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import NoPasskeysSet from './no-passkeys-set';
import { getStatusContent, PASSKEY_STATUS_CODES, TPasskeysStatus } from './passkeys-configs';
import PasskeysList from './passkeys-list';
import PasskeysStatus from './passkeys-status';
import './passkeys.scss';

//TODO need to investigate how to add info about type of key (icon)
//TODO remove mock passkeys
const mock_passkeys_list = [
    {
        id: 1,
        name: 'New Passkey 1',
        last_used_at: 1702365923,
        created_at: 1702365923,
        stored_on: '',
        icon: 'IcFingerprint',
    },
    {
        id: 2,
        name: 'New Passkey 2',
        last_used_at: 1702365923,
        created_at: 1702365923,
        stored_on: '',
        icon: 'IcPattern',
    },
    {
        id: 3,
        name: 'New Passkey 3',
        last_used_at: 1702365923,
        created_at: 1702365923,
        stored_on: '',
        icon: 'IcPasscode',
    },
    {
        id: 4,
        name: 'New Passkey 4',
        last_used_at: 1702365923,
        created_at: 1702365923,
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
    const should_show_passkeys = is_passkeys_enabled && is_passkey_supported && is_mobile;

    const {
        data: passkeys_list,
        isLoading: is_passkeys_list_loading,
        error: passkeys_list_error,
    } = useGetPasskeysList();
    const { createPasskey, is_registration_in_progress, is_passkey_registered, registration_error } =
        useRegisterPasskey();

    React.useEffect(() => {
        if (is_passkey_registered) {
            setPasskeyStatus(PASSKEY_STATUS_CODES.REGISTERED);
        }
    }, [is_passkey_registered]);

    if (is_passkey_support_checked || is_passkeys_list_loading) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }

    if (!should_show_passkeys) {
        return <Redirect to={routes.traders_hub} />;
    }

    // //TODO add error messages and move all content to getStatusContent
    if (passkeys_list_error || registration_error) {
        return (
            <div className='passkeys'>
                <PasskeysStatus
                    icon='IcErrorBadge'
                    title={
                        <Localize
                            i18n_default_text='Our servers hit a bump.<0/> Let’s refresh to try again'
                            components={[<br key={0} />]}
                        />
                    }
                    button_text={<Localize i18n_default_text='Refresh' />}
                    onButtonClick={() => {
                        location.reload();
                    }}
                />
            </div>
        );
    }

    if (passkey_status) {
        const content = getStatusContent(passkey_status);

        let onButtonClick = () => setPasskeyStatus(PASSKEY_STATUS_CODES.NONE);

        if (passkey_status === PASSKEY_STATUS_CODES.RENAMING) {
            onButtonClick = () => setPasskeyStatus(PASSKEY_STATUS_CODES.NONE);
            //TODO: add onclicks for the rest of statuses
        }

        //TODO modify the logic to show different statuses
        return (
            <div className='passkeys'>
                <PasskeysStatus
                    icon={content.icon}
                    title={content.title}
                    button_text={content.button_text}
                    onButtonClick={onButtonClick}
                    description={content.description}
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
                    passkeys_list={passkeys_list}
                    onButtonClick={createPasskey}
                    //TODO: need to check the cases to remove button for creation new passkey (device support)
                    is_creation_available={true}
                />
            )}
        </div>
    );
});

export default Passkeys;
