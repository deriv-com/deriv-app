import { observer, useStore } from '@deriv/stores';
import React from 'react';
import { withRouter } from 'react-router';
import BinaryRoutes from './binary-routes';
import ErrorComponent from './error-component';

const Routes = observer(() => {
    const { client, common } = useStore();
    const { is_logged_in, is_logging_in } = client;
    const { error, has_error } = common;

    if (has_error) return <ErrorComponent {...error} />;

    return <BinaryRoutes is_logged_in={is_logged_in} is_logging_in={is_logging_in} />;
});

export default withRouter(Routes);
