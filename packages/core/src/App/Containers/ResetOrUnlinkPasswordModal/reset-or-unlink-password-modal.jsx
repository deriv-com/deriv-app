import React from 'react';
import { Loading } from '@deriv/components';
import { WS } from 'Services';
import { observer, useStore } from '@deriv/stores';
import LinkExpiredModal from '../LinkExpiredModal';
import ResetPasswordModal from '../ResetPasswordModal';
import UnlinkPasswordModal from '../UnlinkPasswordModal';

const ResetOrUnlinkPasswordModal = observer(() => {
    const { client, ui } = useStore();
    const { is_logged_in } = client;
    const { is_link_expired_modal_visible } = ui;
    const [state, dispatch] = React.useReducer(
        (old_state, updated_state) => {
            return {
                ...old_state,
                ...updated_state,
            };
        },
        {
            is_loading: true,
            is_unlinking: false,
        }
    );

    React.useEffect(() => {
        async function waitForAccountStatus() {
            if (is_logged_in) {
                const data = await WS.wait('get_account_status');
                if (data?.get_account_status?.social_identity_provider) {
                    dispatch({ is_unlinking: true, is_loading: false });
                } else {
                    dispatch({ is_unlinking: false, is_loading: false });
                }
            } else {
                dispatch({ is_unlinking: false, is_loading: false });
            }
        }

        waitForAccountStatus();
    }, [is_logged_in]);

    if (state.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (state.is_unlinking) {
        return <UnlinkPasswordModal />;
    } else if (is_link_expired_modal_visible) {
        return <LinkExpiredModal />;
    }
    return <ResetPasswordModal />;
});

export default ResetOrUnlinkPasswordModal;
