import React from 'react';
import { PlatformContext } from '@deriv/shared';
import { connect } from 'Stores/connect';

const DERIV_APPSTORE_KEY = 'is_appstore';
const DERIV_PRE_APPSTORE_KEY = 'is_pre_appstore';

const PlatformContainer = ({ is_pre_appstore, setIsPreAppStore, ...props }) => {
    // TODO: set is_appstore based on a flag from BE.
    const is_appstore_storage = window.localStorage.getItem(DERIV_APPSTORE_KEY) === 'true';
    const [is_appstore, setIsAppStore] = React.useState(is_appstore_storage);

    React.useEffect(() => {
        window.localStorage.setItem(DERIV_PRE_APPSTORE_KEY, is_pre_appstore);
    }, [is_pre_appstore]);

    const platform_store = {
        is_appstore,
        setIsAppStore,
        DERIV_APPSTORE_KEY,
        is_pre_appstore,
        setIsPreAppStore,
        DERIV_PRE_APPSTORE_KEY,
    };

    return <PlatformContext.Provider value={platform_store} {...props} />;
};

export default connect(({ client }) => ({
    is_pre_appstore: client.is_pre_appstore,
    setIsPreAppStore: client.setIsPreAppStore,
}))(PlatformContainer);
