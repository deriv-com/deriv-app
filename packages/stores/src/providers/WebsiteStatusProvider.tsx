import React from 'react';
import { useSubscription } from '@deriv/api';
import useStore from '../useStore';
import merge from 'lodash.merge';
import { observer } from 'mobx-react-lite';
import { useWS } from '@deriv/shared';

const WebsiteStatusProvider = ({ children }: React.PropsWithChildren<unknown>) => {
    const { data, is_subscribed, subscribe, unsubscribe } = useSubscription('website_status');
    const {
        client: { is_logged_in, is_logging_in, loginid },
        website_status: { update },
    } = useStore();
    const WS = useWS();

    // React.useEffect(subscribe, [subscribe])

    React.useEffect(() => {
        if (data) update(data);
    }, [update, data]);

    // handles case where the response from website_status is different when client is logged in/out
    // refer to socket-general.js
    React.useEffect(() => {
        if (is_logged_in || is_logging_in) {
            if (is_subscribed) unsubscribe();
            WS.get()
                .expectResponse('website_status')
                .then(() => subscribe());
        } else {
            subscribe();
        }
    }, [loginid]);

    return <React.Fragment>{children}</React.Fragment>;
};

export default observer(WebsiteStatusProvider);
