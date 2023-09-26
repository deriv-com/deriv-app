import React from 'react';
import { withRouter } from 'react-router';
import { observer, useStore } from '@deriv/stores';
import { BinaryRoutes } from '../Components/Routes';
import ErrorComponent from '../Components/error-component';

const Routes = observer(() => {
    const { client, common } = useStore();
    const { is_logged_in, is_logging_in } = client;
    const { error, has_error } = common;
    if (has_error) {
        return <ErrorComponent {...error} />;
    }

    return <BinaryRoutes is_logged_in={is_logged_in} is_logging_in={is_logging_in} />;
});

// need to wrap withRouter
// to prevent updates on <BinaryRoutes /> from being blocked
export default withRouter(Routes);
