import { PropTypes as MobxPropTypes } from 'mobx-react';
import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'Stores/connect';
import BinaryRoutes from 'Components/Routes';
import ErrorComponent from 'Components/error-component.jsx';

type RoutesProps = {
    error: unknown;
    has_error: boolean;
    is_logged_in: boolean;
    is_logging_in: boolean;
    is_virtual: boolean;
};

const Routes = ({ error, has_error, is_logged_in, is_logging_in, passthrough }: RoutesProps) => {
    if (has_error) {
        return <ErrorComponent {...error} />;
    }

    return <BinaryRoutes is_logged_in={is_logged_in} is_logging_in={is_logging_in} passthrough={passthrough} />;
};

// need to wrap withRouter around connect
// to prevent updates on <BinaryRoutes /> from being blocked
export default withRouter(
    connect(({ client, common }) => ({
        is_logged_in: client.is_logged_in,
        is_logging_in: client.is_logging_in,
        error: common.error,
        has_error: common.has_error,
    }))(Routes)
);
