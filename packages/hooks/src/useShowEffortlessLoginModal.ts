import React from 'react';
import useIsPasskeySupported from './useIsPasskeySupported';
import useGetPasskeysList from './useGetPasskeysList';

const useShowEffortlessLoginModal = () => {
    const [show_effortless_modal, setShouldShowEffortlessModal] = React.useState(false);
    const { is_passkey_supported, is_passkey_support_checking } = useIsPasskeySupported();
    const { passkeys_list, is_passkeys_list_loading } = useGetPasskeysList();
    const storedValue = localStorage.getItem('show_effortless_login_modal');
    const show_effortless_login_modal = storedValue ? JSON.parse(storedValue) : false;

    React.useEffect(() => {
        if (is_passkeys_list_loading || is_passkey_support_checking) return;
        setShouldShowEffortlessModal(is_passkey_supported && !passkeys_list?.length && show_effortless_login_modal);

        if (!is_passkey_supported || !!passkeys_list?.length) {
            localStorage.setItem('show_effortless_login_modal', JSON.stringify(false));
        }
    }, [
        is_passkey_supported,
        passkeys_list,
        show_effortless_login_modal,
        is_passkeys_list_loading,
        is_passkey_support_checking,
    ]);

    return show_effortless_modal;
};

export default useShowEffortlessLoginModal;
