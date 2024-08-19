import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import BinaryRoutes from '../../Components/Routes';
import ErrorComponent from '../../Components/Errors';
import { observer, useStore } from '@deriv/stores';

type TRoutesProps = RouteComponentProps & { passthrough?: React.ComponentProps<typeof BinaryRoutes>['passthrough'] };

const Routes = observer(({ passthrough }: TRoutesProps) => {
    const { client, common } = useStore();

    const { is_logged_in, is_logging_in } = client;
    const { error, has_error } = common;

    if (has_error) {
        return <ErrorComponent {...error} />;
    }

    return <BinaryRoutes is_logged_in={is_logged_in} is_logging_in={is_logging_in} passthrough={passthrough} />;
});

// need to wrap withRouter around connect
// to prevent updates on <BinaryRoutes /> from being blocked
export default withRouter(Routes);
