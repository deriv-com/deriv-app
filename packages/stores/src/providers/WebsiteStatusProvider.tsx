import React from 'react';
import { useSubscription } from '@deriv/api';
import useStore from '../useStore';
import { reaction } from 'mobx';
import merge from 'lodash.merge';

const WebsiteStatusProvider = ({ children }: React.PropsWithChildren<unknown>) => {
    const { data, subscribe, unsubscribe } = useSubscription('website_status');
    const {
        client: { loginid },
        website_status: { update },
    } = useStore();

    React.useEffect(subscribe, [subscribe]);

    React.useEffect(() => {
        if (data) update(prev => merge(prev, data));
    }, [update, data]);

    // handles case where the response from website_status is different when client is logged in/out
    React.useEffect(() => {
        unsubscribe();
        subscribe();
    }, [loginid]);

    return <React.Fragment>{children}</React.Fragment>;
};

export default WebsiteStatusProvider;
