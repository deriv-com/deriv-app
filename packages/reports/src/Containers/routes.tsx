import React from 'react';
import { withRouter } from 'react-router';
import BinaryRoutes from 'Components/Routes';
import { connect } from 'Stores/connect';
import ErrorComponent from 'Components/Errors';
import { TRootStore } from 'Stores/index';
import { TRoutes } from 'Types';

const Routes = ({ error, has_error, is_logged_in, is_logging_in, passthrough }: TRoutes) => {
    if (has_error) {
        return <ErrorComponent {...error} />;
    }

    return <BinaryRoutes is_logged_in={is_logged_in} is_logging_in={is_logging_in} passthrough={passthrough} />;
};

// need to wrap withRouter around connect
// to prevent updates on <BinaryRoutes /> from being blocked
export default withRouter(
    connect(({ client, common }: TRootStore) => ({
        is_logged_in: client.is_logged_in,
        is_logging_in: client.is_logging_in,
        error: common.error,
        has_error: common.has_error,
    }))(Routes)
);
