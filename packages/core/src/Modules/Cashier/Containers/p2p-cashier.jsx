import React           from 'react';
import { WS }          from 'Services';
import P2P             from '@deriv/p2p';
import { getLanguage } from '@deriv/translations';
import { connect }     from 'Stores/connect';
import ServerTime      from '_common/base/server_time';

/* P2P will use the same websocket connection as Deriv/Binary, we need to pass it as a prop */
const P2PCashier = ({
    currency,
    local_currency_config,
    is_virtual,
    residence,
}) => (
    <P2P
        websocket_api={WS}
        lang={getLanguage()}
        client={{ currency, local_currency_config, is_virtual, residence }}
        server_time={ServerTime}
    />
);

export default connect(
    ({ client }) => ({
        currency             : client.currency,
        local_currency_config: client.local_currency_config,
        is_virtual           : client.is_virtual,
        residence            : client.residence,
    }),
)(P2PCashier);
