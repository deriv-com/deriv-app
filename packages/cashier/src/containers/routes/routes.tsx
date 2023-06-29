import { observer, useStore } from '@deriv/stores';
import React from 'react';
import { withRouter } from 'react-router';
import BinaryRoutes from './binary-routes';
import ErrorComponent from './error-component';

const Routes = observer(() => {
    const { client, common, traders_hub } = useStore();
    const { is_logged_in, is_logging_in, wallet_migration_status } = client;
    const { error, has_error } = common;
    const { setWalletsMigrationInProgressPopup } = traders_hub;

    if (has_error) return <ErrorComponent {...error} />;

    return (
        <BinaryRoutes
            is_logged_in={is_logged_in}
            is_logging_in={is_logging_in}
            is_wallet_migration={wallet_migration_status === 'in_progress'}
            showPopup={setWalletsMigrationInProgressPopup}
        />
    );
});

export default withRouter(Routes);
