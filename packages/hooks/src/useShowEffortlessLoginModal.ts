import React from 'react';
import useIsPasskeySupported from './useIsPasskeySupported';
import useGetPasskeysList from './useGetPasskeysList';

const useShowEffortlessLoginModal = () => {
    const [show_effortless_modal, setShouldShowEffortlessModal] = React.useState(false);
    const { is_passkey_supported } = useIsPasskeySupported();
    const { data: passkey_list } = useGetPasskeysList();
    const storedValue = localStorage.getItem('show_effortless_login_modal');
    const show_effortless_login_modal = storedValue ? JSON.parse(storedValue) : false;

    React.useEffect(() => {
        setShouldShowEffortlessModal(is_passkey_supported && !!true && show_effortless_login_modal);
    }, [is_passkey_supported, passkey_list, show_effortless_login_modal]);

    return show_effortless_modal;
};

export default useShowEffortlessLoginModal;
