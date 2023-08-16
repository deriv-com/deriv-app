import React from 'react';
import { PlatformContext } from '@deriv/shared';
import { useLanguageSettings } from '@deriv/translations';
import { useStore } from '@deriv/stores';
import { useFetch, useRequest } from '@deriv/api';

const DERIV_APPSTORE_KEY = 'is_appstore';

const PlatformContainer = props => {
    const { common, client } = useStore();
    const { is_logged_in, is_authorize } = client;
    const { data } = useFetch('get_settings', { options: { enabled: is_authorize } });
    const { mutate } = useRequest('set_settings', { options: { enabled: is_authorize } });
    const { is_loading, current_language, handleChangeLanguage } = useLanguageSettings();
    const prev_language = React.useRef(current_language);
    // TODO: set is_appstore based on a flag from BE.
    const is_appstore_storage = window.localStorage.getItem(DERIV_APPSTORE_KEY) === 'true';
    const [is_appstore, setIsAppStore] = React.useState(is_appstore_storage);

    const platform_store = {
        is_appstore,
        setIsAppStore,
        DERIV_APPSTORE_KEY,
    };

    React.useEffect(() => {
        if (is_logged_in && data) {
            handleChangeLanguage(data?.get_settings?.preferred_language);
        }
    }, []);

    React.useEffect(() => {
        if (!is_loading) {
            common.handleLanguageChange(current_language);
        }
    }, [common, current_language, is_loading]);

    React.useEffect(() => {
        if (!is_loading && is_logged_in && prev_language !== current_language) {
            mutate({ payload: { preferred_language: current_language } });
            prev_language.current = current_language;
        }
    }, [current_language, is_loading, is_logged_in, mutate]);

    return <PlatformContext.Provider value={platform_store} {...props} />;
};

export default PlatformContainer;
