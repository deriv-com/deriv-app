import React from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/types';
import BinaryRoutes from 'Components/Routes';
import ErrorComponent from 'Components/error-component.jsx';

type TError = {
    header: string;
    message: string;
    type: string;
    redirect_label: string;
    redirect_to: string;
    should_clear_error_on_click: boolean;
    should_show_refresh: boolean;
    redirectOnClick: () => void;
    setError: (has_error: boolean, error: TError) => void;
};

type TRoutesProps = RouteComponentProps & {
    error: TError;
    has_error: boolean;
    is_logged_in: boolean;
    is_logging_in: boolean;
};

// george removed passthrough prop?, because we didn't pass it when
// return <Routes /> component from <App /> component in cashier package
const Routes = ({ error, has_error, is_logged_in, is_logging_in }: TRoutesProps) => {
    if (has_error) {
        return <ErrorComponent {...error} />;
    }

    return <BinaryRoutes is_logged_in={is_logged_in} is_logging_in={is_logging_in} />;
};

// need to wrap withRouter around connect
// to prevent updates on <BinaryRoutes /> from being blocked
export default withRouter(
    connect(({ client, common }: RootStore) => ({
        is_logged_in: client.is_logged_in,
        is_logging_in: client.is_logging_in,
        error: common.error,
        has_error: common.has_error,
    }))(Routes)
);
