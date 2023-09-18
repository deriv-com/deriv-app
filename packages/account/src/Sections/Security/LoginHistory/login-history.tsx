import React from 'react';
import { Loading, ThemedScrollbars } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useLoginHistory } from '@deriv/api';
import LoadErrorMessage from 'Components/load-error-message';
import LoginHistoryContent from './login-history-content';
import { isServerError } from 'Helpers/utils';

const LoginHistory = observer(() => {
    const {
        client,
        ui: { is_mobile },
    } = useStore();
    const { is_switching } = client;

    const { data, isError, isLoading, error } = useLoginHistory({ limit: 50 });

    const login_history = data?.formatted_data;

    if (is_switching) return <Loading />;
    if (isLoading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (isError) return <LoadErrorMessage error_message={isServerError(error) ? error.message : undefined} />;

    return (
        <ThemedScrollbars is_bypassed={is_mobile} className='login-history'>
            {login_history.length && <LoginHistoryContent data={login_history} />}
        </ThemedScrollbars>
    );
});

export default LoginHistory;
