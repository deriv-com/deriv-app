import React from 'react';
import { withRouter } from 'react-router-dom';
import P2P from '@deriv/p2p';
import { observer } from '@deriv/stores';

/* P2P will use the same websocket connection as Deriv/Binary, we need to pass it as a prop */
const P2PCashier = observer(() => {
    return <P2P />;
});

export default withRouter(P2PCashier);
