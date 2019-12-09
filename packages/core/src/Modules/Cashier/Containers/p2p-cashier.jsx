import React           from 'react';
import { WS }          from 'Services';
import P2P             from 'deriv-p2p';
import { getLanguage } from 'deriv-translations';

/* P2P will use the same websocket connection as Deriv/Binary, we needs to pass it as props */
const P2PCashier = () => <P2P websocket_api={WS} lang={getLanguage()} />;

export default P2PCashier;
