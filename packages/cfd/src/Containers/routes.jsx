import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import BinaryRoutes from '../Components/Routes';
import ErrorComponent from '../Components/Errors/error-component.jsx';
import { observer, useStore } from '@deriv/stores';

const Routes = observer(({ passthrough }) => {
    const {
        client: { is_logged_in, is_logging_in },
        common: { error, has_error },
    } = useStore();

    if (has_error) {
        return <ErrorComponent {...error} />;
    }

    return <BinaryRoutes is_logged_in={is_logged_in} is_logging_in={is_logging_in} passthrough={passthrough} />;
});

Routes.propTypes = {
    passthrough: PropTypes.object,
};

// need to wrap withRouter around connect
// to prevent updates on <BinaryRoutes /> from being blocked
export default withRouter(Routes);
