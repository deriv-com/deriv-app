import { observer, useStore } from '@deriv/stores';
import React from 'react';
import { withRouter } from 'react-router';
import BinaryRoutes from './binary-routes';
import ErrorComponent from './error-component';
import { useWalletMigration } from '@deriv/hooks';

const Routes = observer(() => {
    const { client, common, traders_hub } = useStore();
    const { is_logged_in, is_logging_in } = client;
    const { error, has_error } = common;
    const { setWalletsMigrationInProgressPopup } = traders_hub;
    const { status } = useWalletMigration();

    if (has_error) return <ErrorComponent {...error} />;

    return (
        <BinaryRoutes
            is_logged_in={is_logged_in}
            is_logging_in={is_logging_in}
            is_wallet_migration={status === 'in_progress'}
            showPopup={setWalletsMigrationInProgressPopup}
        />
    );
});

export default withRouter(Routes);
