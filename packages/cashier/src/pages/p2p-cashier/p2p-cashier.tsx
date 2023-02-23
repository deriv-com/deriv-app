import React from 'react';
import { withRouter } from 'react-router-dom';
import P2P from '@deriv/p2p';
import { observer, useStore } from '@deriv/stores';

/* P2P will use the same websocket connection as Deriv/Binary, we need to pass it as a prop */
const P2PCashier = observer(() => {
    const { modules } = useStore();
    const { cashier } = modules;
    const { general_store } = cashier;
    const { setNotificationCount } = general_store;

    return <P2P setNotificationCount={setNotificationCount} />;
});

export default withRouter(P2PCashier);
