import { observer, useStore } from '@deriv/stores';
import React from 'react';
import { withRouter } from 'react-router';
import BinaryRoutes from './binary-routes';
import ErrorComponent from './error-component';
import { useWalletMigration } from '@deriv/hooks';

const Routes = observer(() => {
    const { client, common } = useStore();
    const { is_logged_in, is_logging_in, setWalletsMigrationInProgressPopup } = client;
    const { error, has_error } = common;
    const { is_in_progress } = useWalletMigration();

    if (has_error) return <ErrorComponent {...error} />;

    return (
        <BinaryRoutes
            is_logged_in={is_logged_in}
            is_logging_in={is_logging_in}
            is_wallet_migration={is_in_progress}
            showPopup={setWalletsMigrationInProgressPopup}
        />
    );
});

export default withRouter(Routes);
