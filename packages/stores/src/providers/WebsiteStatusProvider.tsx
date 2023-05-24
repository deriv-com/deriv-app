import React from 'react';
import { useSubscription } from '@deriv/api';
import useStore from '../useStore';
import { useWS } from '@deriv/shared';
import merge from 'lodash.merge';

const WebsiteStatusProvider = ({ children }: React.PropsWithChildren<unknown>) => {
    const { data, is_subscribed, subscribe, unsubscribe } = useSubscription('website_status');
    const {
        client: { is_logged_in, is_logging_in, loginid },
        website_status: { update },
    } = useStore();
    const WS = useWS();

    React.useEffect(() => {
        if (data) update(prev => merge(prev, data));
    }, [update, data]);

    React.useEffect(() => {
        // handles case where the response from website_status is different when client is logged in/out, we need to re-subscribe in that case
        // refer to socket-general.js
        if (is_logged_in || is_logging_in) {
            if (is_subscribed) unsubscribe();
            WS.get()
                .expectResponse('authorize')
                .then(() => {
                    subscribe();
                });
        } else {
            subscribe();
        }
    }, [is_logged_in, is_logging_in, loginid, subscribe]);

    return <React.Fragment>{children}</React.Fragment>;
};

export default WebsiteStatusProvider;
