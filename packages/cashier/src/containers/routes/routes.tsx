import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { useTheme } from '@deriv/ui';
import { connect } from 'Stores/connect';
import { TClientStore, TCommonStore, TRootStore } from 'Types';
import BinaryRoutes from './binary-routes';
import ErrorComponent from './error-component';

type TRoutesProps = RouteComponentProps & {
    error: TCommonStore['error'];
    has_error: TCommonStore['has_error'];
    is_logged_in: TClientStore['is_logged_in'];
    is_logging_in: TClientStore['is_logging_in'];
    is_dark_mode_on: boolean;
};

const Routes = ({ error, has_error, is_logged_in, is_logging_in, is_dark_mode_on }: TRoutesProps) => {
    const { setColorMode } = useTheme();

    React.useEffect(() => {
        setColorMode(is_dark_mode_on ? 'dark' : 'light');
    }, [is_dark_mode_on]);

    if (has_error) {
        return <ErrorComponent {...error} />;
    }

    return <BinaryRoutes is_logged_in={is_logged_in} is_logging_in={is_logging_in} />;
};

// need to wrap withRouter around connect
// to prevent updates on <BinaryRoutes /> from being blocked
export default connect(({ client, common, ui }: TRootStore) => ({
    is_logged_in: client.is_logged_in,
    is_logging_in: client.is_logging_in,
    error: common.error,
    has_error: common.has_error,
    is_dark_mode_on: ui.is_dark_mode_on,
}))(withRouter(Routes));
