import React  from 'react';
import { WS } from 'Services';
import P2P    from 'deriv-p2p';

const P2PCashier = () => <P2P websocket_api={WS} />;

export default P2PCashier;
