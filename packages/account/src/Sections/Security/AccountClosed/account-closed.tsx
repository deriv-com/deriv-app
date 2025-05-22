import { useCallback, useEffect, useState } from 'react';

import { Modal, Text } from '@deriv/components';
import { useOauth2 } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv-com/translations';
import { URLUtils } from '@deriv-com/utils';

const AccountClosed = observer(() => {
    const { client } = useStore();
    const { logout } = client;
    const { oAuthLogout } = useOauth2({
        handleLogout: async () => {
            await logout();
        },
    });
    const [is_modal_open, setModalState] = useState(true);
    const [timer, setTimer] = useState(10);

    const counter = useCallback(() => {
        if (timer > 0) {
            setTimer(timer - 1);
        } else {
            window.location.href = URLUtils.getDerivStaticURL('/');
        }
    }, [timer]);

    useEffect(() => {
        window.history.pushState(null, '', '/');
        oAuthLogout();
        const handleInterval = setInterval(() => counter(), 1000);
        return () => {
            if (handleInterval) clearInterval(handleInterval);
        };
    }, [timer, is_modal_open, logout, counter, oAuthLogout]);

    return (
        <Modal
            is_open={is_modal_open}
            toggleModal={() => {
                setModalState(!is_modal_open);
            }}
        >
            <Text as='p' className='account-closed'>
                <Localize i18n_default_text='We’re sorry to see you leave. Your account is now closed.' /> {timer}
            </Text>
        </Modal>
    );
});

export default AccountClosed;
