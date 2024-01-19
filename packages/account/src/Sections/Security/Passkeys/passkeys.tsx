import React from 'react';
import { Redirect } from 'react-router-dom';
import { Icon, Loading } from '@deriv/components';
import { useGetPasskeysList, useIsPasskeySupported, useRegisterPasskey } from '@deriv/hooks';
import { PlatformContext, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import PasskeysFooterButtons from './components/passkeys-footer-buttons';
import PasskeysList from './components/passkeys-list';
import PasskeysStatus from './components/passkeys-status';
import { getStatusContent, PASSKEY_STATUS_CODES, TPasskeysStatus } from './passkeys-configs';
import './passkeys.scss';

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
    const [is_learn_more_opened, setIsLearnMoreOpened] = React.useState(false);

    const { is_passkey_supported, is_loading: is_passkey_support_checked } = useIsPasskeySupported();
    const should_show_passkeys = is_passkeys_enabled && is_passkey_supported && is_mobile;

    const {
        data: passkeys_list,
        isLoading: is_passkeys_list_loading,
        error: passkeys_list_error,
    } = useGetPasskeysList();
    const { createPasskey, is_registration_in_progress, is_passkey_registered, registration_error } =
        useRegisterPasskey();

    // eslint-disable-next-line no-console
    console.log('is_passkey_registered', is_passkey_registered);
    React.useEffect(() => {
        if (is_passkey_registered) {
            setPasskeyStatus(PASSKEY_STATUS_CODES.CREATED);
        } else {
            setPasskeyStatus(PASSKEY_STATUS_CODES.NONE);
        }

        // setIsLearnMoreOpened(false)
    }, [is_passkey_registered]);

    if (is_passkey_support_checked || is_passkeys_list_loading) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }

    if (!should_show_passkeys) {
        return <Redirect to={routes.traders_hub} />;
    }

    // TODO add error messages and move all content to getStatusContent
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
                >
                    <PasskeysFooterButtons
                        button_text={<Localize i18n_default_text='Refresh' />}
                        onButtonClick={() => {
                            location.reload();
                        }}
                    />
                </PasskeysStatus>
            </div>
        );
    }

    if (passkey_status) {
        const content = getStatusContent(passkey_status, () => setIsLearnMoreOpened(true));

        let onButtonClick = () => setPasskeyStatus(PASSKEY_STATUS_CODES.NONE);
        let onBackButtonClick;

        if (passkey_status === PASSKEY_STATUS_CODES.LEARN_MORE) {
            onButtonClick = createPasskey;
        }

        if (passkey_status === PASSKEY_STATUS_CODES.NO_PASSKEY) {
            onButtonClick = createPasskey;
            onBackButtonClick = () => {
                setIsLearnMoreOpened(true);
                setPasskeyStatus(PASSKEY_STATUS_CODES.LEARN_MORE);
            };
        }

        if (passkey_status === PASSKEY_STATUS_CODES.RENAMING) {
            //TODO implement renaming flow
            onBackButtonClick = () => setPasskeyStatus(PASSKEY_STATUS_CODES.NONE);
        }

        if (passkey_status === PASSKEY_STATUS_CODES.VERIFYING) {
            //TODO implement verifying flow (send email)
        }

        return (
            <div className='passkeys'>
                {is_learn_more_opened && (
                    <Icon
                        icon='IcBackButton'
                        onClick={() => setIsLearnMoreOpened(false)}
                        className='passkeys-status__description-back-button'
                    />
                )}
                <PasskeysStatus
                    className={is_learn_more_opened ? 'passkeys-status__wrapper--expanded' : ''}
                    icon={content.icon}
                    title={content.title}
                    description={content.description}
                >
                    <PasskeysFooterButtons
                        button_text={content.button_text}
                        onButtonClick={onButtonClick}
                        back_button_text={content.back_button_text}
                        onBackButtonClick={onBackButtonClick}
                    />
                </PasskeysStatus>
            </div>
        );
    }

    return (
        <div className='passkeys'>
            <PasskeysList passkeys_list={passkeys_list || []} onButtonClick={createPasskey} />
        </div>
    );
});

export default Passkeys;
