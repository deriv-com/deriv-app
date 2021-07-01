import React from 'react';
import { connect } from 'Stores/connect';
import { Loading } from '@deriv/components';
import { WS } from 'Services';
import UnlinkPasswordModal from '../UnlinkPasswordModal';
import ResetPasswordModal from '../ResetPasswordModal';

const ResetOrUnlinkPasswordModal = ({ is_logged_in }) => {
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
    }

    return <ResetPasswordModal />;
};

export default connect(({ client }) => ({
    is_logged_in: client.is_logged_in,
}))(ResetOrUnlinkPasswordModal);
