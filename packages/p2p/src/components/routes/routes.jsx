import React from 'react';
import { withRouter } from 'react-router';
import { observer, useStore } from '@deriv/stores';
import { useStores } from 'Stores';
import BinaryRoutes from './binary-routes';
import ErrorComponent from './error-component';
import Dp2pBlocked from 'Components/dp2p-blocked';

const Routes = observer(() => {
    const { general_store } = useStores();
    const { client, common } = useStore();
    const { is_logged_in, is_logging_in } = client;
    const { error, has_error } = common;

    if (has_error) return <ErrorComponent {...error} />;

    if (general_store.should_show_dp2p_blocked) {
        return <Dp2pBlocked />;
    }

    return <BinaryRoutes is_logged_in={is_logged_in} is_logging_in={is_logging_in} />;
});

export default withRouter(Routes);
