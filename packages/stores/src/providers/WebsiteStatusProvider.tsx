import React, { useEffect } from 'react';
import { useSubscription } from '@deriv/api';
import { observer } from 'mobx-react-lite';
import useStore from '../useStore';

const WebsiteStatusProvider = observer(({ children }: React.PropsWithChildren<unknown>) => {
    const { data, subscribe, unsubscribe } = useSubscription('website_status');
    const {
        client: { is_authorize, is_logged_in, is_logging_in },
        website_status: { update },
    } = useStore();

    useEffect(() => {
        if (data) {
            const { website_status } = data;
            if (website_status) update(website_status);
        }
    }, [update, data]);

    // handles case where the response from website_status is different when client is logged in/out, we need to re-subscribe if client is logging in
    // refer to socket-general.j
    useEffect(() => {
        // need to wait for 'authorize' to be responded by the websocket 'is_authorize=true', only then we re-subscribe to website_status
        if (!is_authorize) {
            unsubscribe();
        } else {
            subscribe();
        }
    }, [is_authorize, subscribe, unsubscribe]);

    // this handles the case when user is logged out
    useEffect(() => {
        if (!is_logged_in && !is_logging_in) {
            subscribe();
        }
    }, [is_logging_in, is_logged_in, subscribe, unsubscribe]);

    return <>{children}</>;
});

export default WebsiteStatusProvider;
