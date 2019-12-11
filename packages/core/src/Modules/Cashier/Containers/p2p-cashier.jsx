import React           from 'react';
import { WS }          from 'Services';
import P2P             from 'deriv-p2p';
import { getLanguage } from 'deriv-translations';
import { connect }     from 'Stores/connect';

/* P2P will use the same websocket connection as Deriv/Binary, we needs to pass it as props */
const P2PCashier = ({ currency, is_virtual, landing_company_shortcode }) => (
    <P2P
        websocket_api={WS}
        lang={getLanguage()}
        client={{ currency, is_virtual, landing_company_shortcode }}
    />
);

export default connect(
    ({ client }) => ({
        currency                 : client.currency,
        is_virtual               : client.is_virtual,
        landing_company_shortcode: client.landing_company_shortcode,
    }),
)(P2PCashier);

