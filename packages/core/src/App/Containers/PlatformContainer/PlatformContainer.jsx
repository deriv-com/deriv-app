import React from 'react';
import { PlatformContext } from '@deriv/shared';
import { useLanguageSettings } from '@deriv/translations';
import { useStore } from '@deriv/stores';

const DERIV_APPSTORE_KEY = 'is_appstore';

const PlatformContainer = props => {
    const { common } = useStore();
    const { current_language } = useLanguageSettings();
    // TODO: set is_appstore based on a flag from BE.
    const is_appstore_storage = window.localStorage.getItem(DERIV_APPSTORE_KEY) === 'true';
    const [is_appstore, setIsAppStore] = React.useState(is_appstore_storage);

    const platform_store = {
        is_appstore,
        setIsAppStore,
        DERIV_APPSTORE_KEY,
    };

    React.useEffect(() => {
        common.handleLanguageChange(current_language);
    }, [common, current_language]);

    return <PlatformContext.Provider value={platform_store} {...props} />;
};

export default PlatformContainer;
