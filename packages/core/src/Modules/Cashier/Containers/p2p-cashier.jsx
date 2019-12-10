import React           from 'react';
import { WS }          from 'Services';
import P2P             from 'deriv-p2p';
import { getLanguage } from 'deriv-translations';
import { connect }            from 'Stores/connect';

/* P2P will use the same websocket connection as Deriv/Binary, we needs to pass it as props */
const P2PCashier = ({ currency, is_virtual }) => (
    <P2P
        websocket_api={WS}
        lang={getLanguage()}
        client={{ is_virtual, currency }}
    />
);

export default connect(
    ({ client }) => ({
        is_virtual: client.is_virtual,
        currency  : client.currency,
    }),
)(P2PCashier);

