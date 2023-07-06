import React, { useEffect } from 'react';
import { useSubscription } from '@deriv/api';
import { observer } from 'mobx-react-lite';
import useStore from '../useStore';
import merge from 'lodash.merge';

const WebsiteStatusProvider = observer(({ children }: React.PropsWithChildren<unknown>) => {
    const { data, subscribe, unsubscribe } = useSubscription('website_status');
    const {
        client: { is_authorize },
        website_status: { update },
    } = useStore();

    useEffect(() => {
        if (data) {
            const { website_status } = data;
            if (website_status) update(prev => merge(prev, website_status));
        }
    }, [update, data]);

    useEffect(() => {
        if (is_authorize) unsubscribe()
        subscribe()
    }, [is_authorize, subscribe, unsubscribe]);

    return <>{children}</>;
});

export default WebsiteStatusProvider;
