import React from 'react';
import { PlatformContext } from '@deriv/shared';

const DERIV_APPSTORE_KEY = 'is_appstore';

const PlatformContainer = props => {
    // TODO: set is_appstore based on a flag from BE.
    const is_appstore_storage = window.localStorage.getItem(DERIV_APPSTORE_KEY) === 'true';
    const [is_appstore, setIsAppStore] = React.useState(is_appstore_storage);

    const platform_store = {
        is_appstore,
        setIsAppStore,
        DERIV_APPSTORE_KEY,
    };

    return <PlatformContext.Provider value={platform_store} {...props} />;
};

export default PlatformContainer;
