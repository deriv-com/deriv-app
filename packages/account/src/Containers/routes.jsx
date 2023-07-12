import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { BinaryRoutes } from 'Components/Routes';
import { observer, useStore } from '@deriv/stores';
import ErrorComponent from 'Components/error-component';

const Routes = observer(props => {
    const { client, common } = useStore();
    const { is_logged_in, is_logging_in } = client;
    const { error, has_error } = common;
    if (has_error) {
        return <ErrorComponent {...error} />;
    }

    return <BinaryRoutes is_logged_in={is_logged_in} is_logging_in={is_logging_in} passthrough={props.passthrough} />;
});

Routes.propTypes = {
    is_virtual: PropTypes.bool,
    passthrough: PropTypes.object,
};

// need to wrap withRouter around connect
// to prevent updates on <BinaryRoutes /> from being blocked
export default withRouter(Routes);
