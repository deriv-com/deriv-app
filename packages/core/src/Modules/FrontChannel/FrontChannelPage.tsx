import React from 'react';
import { withRouter } from 'react-router-dom';
import { useStore } from '@deriv/stores';

const FrontChannelPage = () => {
    const store = useStore();
    const { logout, is_client_store_initialized } = store.client;

    React.useEffect(() => {
        if (is_client_store_initialized) logout();
    }, [is_client_store_initialized]);
    return <></>;
};

export default withRouter(FrontChannelPage);
