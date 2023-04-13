import React from 'react';
import { withRouter } from 'react-router';
import BinaryRoutes from './binary-routes';
import { useStore } from '@deriv/stores';

const Routes = () => {
    const { client, common } = useStore();
    const { is_logged_in, is_logging_in } = client;
    const { error, has_error } = common;

    if (has_error) {
        throw new Error({ ...error });
        // return <ErrorComponent {...props.error} />;
    }

    return <BinaryRoutes is_logged_in={is_logged_in} is_logging_in={is_logging_in} />;
};

// need to wrap withRouter around connect
// to prevent updates on <BinaryRoutes /> from being blocked
export default withRouter(Routes);
