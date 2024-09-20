import { Fragment, useEffect, useRef, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { InlineMessage, Loading } from '@deriv/components';
import { useGetPasskeysList, useRegisterPasskey, useRemovePasskey, useRenamePasskey } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv-com/translations';
import { PasskeyErrorModal } from './components/passkey-error-modal';
import { PasskeyReminderModal } from './components/passkey-reminder-modal';
import { PasskeyRemoveConfirmationModal } from './components/passkey-remove-confirmation-modal';
import { PasskeysStatusContainer } from './components/passkeys-status-container';
import {
    clearRefTimeOut,
    excluded_error_codes,
    excluded_error_names,
    isNotExistedPasskey,
    PASSKEY_STATUS_CODES,
    passkeysMenuActionEventTrack,
    TPasskeysStatus,
} from './passkeys-configs';
import { TServerError } from '../../../Types';
import './passkeys.scss';

export type TPasskey = {
    id: number;
    name: string;
    last_used: number;
    created_at?: number;
    stored_on?: string;
    passkey_id: string;
    icon?: string;
};
export type TOnPasskeyMenuClick = (
    passkey_managing_status: TPasskeysStatus,
    passkey_data: TCurrentManagedPasskey
) => void;
export type TCurrentManagedPasskey = {
    id: TPasskey['id'];
    passkey_id: TPasskey['passkey_id'];
    name: TPasskey['name'];
};

const Passkeys = observer(() => {
    const { client, common, notifications } = useStore();
    const { isMobile } = useDevice();
    const { is_passkey_supported, setShouldShowPasskeyNotification, setPasskeysStatusToCookie } = client;
    const { removeNotificationByKey } = notifications;
    const is_network_on = common.network_status.class === 'online';

    const error_modal_timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const snackbar_timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const history = useHistory();

    const [passkey_status, setPasskeyStatus] = useState<TPasskeysStatus>(PASSKEY_STATUS_CODES.LIST);
    const [is_reminder_modal_open, setIsReminderModalOpen] = useState(false);
    const [is_error_modal_open, setIsErrorModalOpen] = useState(false);
    const [is_snackbar_open, setIsSnackbarOpen] = useState(false);
    const [current_managed_passkey, setCurrentManagedPasskey] = useState<TCurrentManagedPasskey>({
        id: 0,
        passkey_id: '',
        name: '',
    });

    const onSuccessPasskeyRegister = () => {
        setShouldShowPasskeyNotification(false);
        removeNotificationByKey({ key: 'enable_passkey' });
        refetchPasskeysList();
        passkeysMenuActionEventTrack('create_passkey_finished');
        setPasskeyStatus(PASSKEY_STATUS_CODES.CREATED);
        setPasskeysStatusToCookie('available');
    };

    const onSuccessPasskeyRemove = () => {
        refetchPasskeysList();
        setPasskeyStatus(PASSKEY_STATUS_CODES.REMOVED);
        passkeysMenuActionEventTrack('passkey_remove_success');
    };

    const onSuccessPasskeyRename = () => {
        refetchPasskeysList();
        setPasskeyStatus(PASSKEY_STATUS_CODES.LIST);
        setIsSnackbarOpen(true);
        passkeysMenuActionEventTrack('passkey_rename_success');
        clearRefTimeOut(snackbar_timeout);
        snackbar_timeout.current = setTimeout(() => {
            setIsSnackbarOpen(false);
        }, 5000);
    };

    const { passkeys_list, is_passkeys_list_loading, passkeys_list_error, refetchPasskeysList } = useGetPasskeysList();
    const { passkey_removing_error, removePasskey } = useRemovePasskey({ onSuccess: onSuccessPasskeyRemove });
    const { passkey_renaming_error, renamePasskey } = useRenamePasskey({ onSuccess: onSuccessPasskeyRename });
    const { createPasskey, startPasskeyRegistration, passkey_registration_error } = useRegisterPasskey({
        onSuccess: onSuccessPasskeyRegister,
    });

    const should_show_passkeys = is_passkey_supported && isMobile;
    const error = passkeys_list_error || passkey_registration_error || passkey_renaming_error || passkey_removing_error;

    useEffect(() => {
        const should_not_render_main_page =
            is_passkeys_list_loading ||
            passkey_status === PASSKEY_STATUS_CODES.CREATED ||
            passkey_status === PASSKEY_STATUS_CODES.REMOVED;

        if (should_not_render_main_page) return;

        if (!passkeys_list?.length) {
            setPasskeyStatus(PASSKEY_STATUS_CODES.NO_PASSKEY);
            setPasskeysStatusToCookie('not_available');
        } else {
            setPasskeyStatus(PASSKEY_STATUS_CODES.LIST);
        }
        return () => clearRefTimeOut(snackbar_timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_passkeys_list_loading, passkeys_list?.length]);

    useEffect(() => {
        if (error) {
            passkeysMenuActionEventTrack('error', { error_message: (error as TServerError)?.message });

            const should_hide_error =
                excluded_error_names.some(name => name === (error as TServerError).name) ||
                excluded_error_codes.some(code => code === (error as TServerError).code);

            if (should_hide_error) return;

            if (passkey_status === PASSKEY_STATUS_CODES.REMOVING) {
                setPasskeyStatus(passkeys_list?.length ? PASSKEY_STATUS_CODES.LIST : PASSKEY_STATUS_CODES.NO_PASSKEY);
            }

            is_reminder_modal_open && setIsReminderModalOpen(false);
            clearRefTimeOut(error_modal_timeout);
            error_modal_timeout.current = setTimeout(() => setIsErrorModalOpen(true), 500);
        }
        return () => clearRefTimeOut(error_modal_timeout);
    }, [error, is_reminder_modal_open]);

    if (!should_show_passkeys) {
        return <Redirect to={routes.traders_hub} />;
    }

    if ((is_passkeys_list_loading && passkey_status === PASSKEY_STATUS_CODES.LIST) || !is_network_on) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }

    const onCloseErrorModal = () => {
        history.push(routes.traders_hub);
    };

    const onCloseReminderModal = () => {
        setIsReminderModalOpen(false);
    };

    const onContinueReminderModal = () => {
        createPasskey();
        if (!error) {
            passkeysMenuActionEventTrack('create_passkey_reminder_passed');
        }
        setIsReminderModalOpen(false);
    };

    const onPasskeyMenuClick = (passkey_managing_status: TPasskeysStatus, passkey_data: TCurrentManagedPasskey) => {
        if (passkey_managing_status !== PASSKEY_STATUS_CODES.LIST && is_snackbar_open) {
            setIsSnackbarOpen(false);
        }
        setCurrentManagedPasskey(passkey_data);
        setPasskeyStatus(passkey_managing_status);
    };

    const onPrimaryButtonClick = (passkey_data?: Partial<TCurrentManagedPasskey>) => {
        if (
            passkey_status === PASSKEY_STATUS_CODES.NO_PASSKEY ||
            passkey_status === PASSKEY_STATUS_CODES.LIST ||
            passkey_status === PASSKEY_STATUS_CODES.LEARN_MORE
        ) {
            const subform_name = passkey_status === PASSKEY_STATUS_CODES.LEARN_MORE ? 'passkey_info' : 'passkey_main';
            passkeysMenuActionEventTrack('create_passkey_started', { subform_name });
            startPasskeyRegistration();
            setIsReminderModalOpen(true);
        }
        if (passkey_status === PASSKEY_STATUS_CODES.CREATED) {
            passkeysMenuActionEventTrack('create_passkey_continue_trading');
            history.push(routes.traders_hub);
        }
        if (passkey_status === PASSKEY_STATUS_CODES.RENAMING) {
            renamePasskey(current_managed_passkey.id, passkey_data?.name ?? current_managed_passkey.name);
        }
        if (passkey_status === PASSKEY_STATUS_CODES.REMOVED) {
            setPasskeyStatus(passkeys_list?.length ? PASSKEY_STATUS_CODES.LIST : PASSKEY_STATUS_CODES.NO_PASSKEY);
        }
        // next condition is for future additional verification screen
        // if (passkey_status === PASSKEY_STATUS_CODES.REMOVING) {
        //     removePasskey(current_managed_passkey?.id);
        // }
    };

    const onSecondaryButtonClick = () => {
        if (passkey_status === PASSKEY_STATUS_CODES.NO_PASSKEY || passkey_status === PASSKEY_STATUS_CODES.LIST) {
            passkeysMenuActionEventTrack('info_open');
            setPasskeyStatus(PASSKEY_STATUS_CODES.LEARN_MORE);
        }
        if (passkey_status === PASSKEY_STATUS_CODES.LEARN_MORE || passkey_status === PASSKEY_STATUS_CODES.REMOVING) {
            passkeysMenuActionEventTrack('info_back');
            setPasskeyStatus(passkeys_list?.length ? PASSKEY_STATUS_CODES.LIST : PASSKEY_STATUS_CODES.NO_PASSKEY);
        }
        if (passkey_status === PASSKEY_STATUS_CODES.CREATED) {
            passkeysMenuActionEventTrack('add_more_passkeys');
            setPasskeyStatus(PASSKEY_STATUS_CODES.LIST);
        }
        if (passkey_status === PASSKEY_STATUS_CODES.RENAMING) {
            passkeysMenuActionEventTrack('passkey_rename_back');
            setPasskeyStatus(PASSKEY_STATUS_CODES.LIST);
        }
    };

    return (
        <Fragment>
            <PasskeysStatusContainer
                current_managed_passkey={current_managed_passkey}
                onPasskeyMenuClick={onPasskeyMenuClick}
                onPrimaryButtonClick={onPrimaryButtonClick}
                onSecondaryButtonClick={onSecondaryButtonClick}
                passkey_status={passkey_status}
                passkeys_list={passkeys_list || []}
            />
            {is_snackbar_open && (
                <div className='passkeys-snackbar__container'>
                    <InlineMessage
                        size='sm'
                        message={<Localize i18n_default_text='Changes saved.' />}
                        type='information'
                    />
                </div>
            )}
            <PasskeyReminderModal
                is_modal_open={is_reminder_modal_open}
                onButtonClick={onContinueReminderModal}
                toggleModal={onCloseReminderModal}
            />
            <PasskeyErrorModal error={error} is_modal_open={is_error_modal_open} onButtonClick={onCloseErrorModal} />
            {/* TODO: Remove confirmation modal, when verification page is implemented*/}
            <PasskeyRemoveConfirmationModal
                is_modal_open={passkey_status === PASSKEY_STATUS_CODES.REMOVING && !is_error_modal_open}
                onSecondaryButtonClick={() => {
                    setPasskeyStatus(
                        passkeys_list?.length ? PASSKEY_STATUS_CODES.LIST : PASSKEY_STATUS_CODES.NO_PASSKEY
                    );
                }}
                onPrimaryButtonClick={() => {
                    removePasskey(current_managed_passkey?.id);
                }}
            />
        </Fragment>
    );
});

export default Passkeys;
