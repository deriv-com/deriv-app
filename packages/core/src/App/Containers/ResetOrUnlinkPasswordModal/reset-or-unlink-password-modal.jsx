import React from 'react';
import { Loading } from '@deriv/components';
import { WS } from 'Services';
import UnlinkPasswordModal from '../UnlinkPasswordModal';
import ResetPasswordModal from '../ResetPasswordModal';

const ResetOrUnlinkPasswordModal = () => {
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
        WS.wait('get_account_status').then(data => {
            if (data?.get_account_status?.social_identity_provider) {
                dispatch({ is_unlinking: true, is_loading: false });
            } else {
                dispatch({ is_unlinking: false, is_loading: false });
            }
        });
    }, []);

    if (state.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (state.is_unlinking) {
        return <UnlinkPasswordModal />;
    }

    return <ResetPasswordModal />;
};

export default ResetOrUnlinkPasswordModal;
