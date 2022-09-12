import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'Stores/connect';
import { TRootStore } from 'Types';
import BinaryRoutes from './binary-routes';
import ErrorComponent from './error-component';

type TRoutesProps = RouteComponentProps & {
    error: TRootStore['common']['error'];
    has_error: TRootStore['common']['has_error'];
    is_logged_in: TRootStore['client']['is_logged_in'];
    is_logging_in: TRootStore['client']['is_logging_in'];
};

const Routes = ({ error, has_error, is_logged_in, is_logging_in }: TRoutesProps) => {
    if (has_error) {
        return <ErrorComponent {...error} />;
    }

    return <BinaryRoutes is_logged_in={is_logged_in} is_logging_in={is_logging_in} />;
};

// need to wrap withRouter around connect
// to prevent updates on <BinaryRoutes /> from being blocked
export default connect(({ client, common }: TRootStore) => ({
    is_logged_in: client.is_logged_in,
    is_logging_in: client.is_logging_in,
    error: common.error,
    has_error: common.has_error,
}))(withRouter(Routes));
