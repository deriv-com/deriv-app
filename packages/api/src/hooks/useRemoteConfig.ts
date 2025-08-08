import { useEffect, useRef, useState } from 'react';

import { ObjectUtils } from '@deriv-com/utils';

import initData from '../remote_config.json';

const remoteConfigQuery = async function () {
    const REMOTE_CONFIG_URL =
        process.env.NODE_ENV === 'production'
            ? 'https://app-config-prod.firebaseio.com/remote_config/deriv-app.json'
            : 'https://app-config-staging.firebaseio.com/remote_config/deriv-app.json';
    const response = await fetch(REMOTE_CONFIG_URL);
    if (!response.ok) {
        throw new Error('Remote Config Server is out of reach!');
    }
    return response.json();
};

function useRemoteConfig(enabled = false) {
    const [data, setData] = useState(initData);
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (enabled) {
            remoteConfigQuery()
                .then(async res => {
                    const resHash = await ObjectUtils.hashObject(res);
                    const dataHash = await ObjectUtils.hashObject(data);
                    if (resHash !== dataHash && isMounted.current) {
                        setData(res);
                    }
                })
                .catch(error => {
                    // eslint-disable-next-line no-console
                    console.log('Remote Config error: ', error);
                });
        }
    }, [enabled, data]);

    return { data };
}

export default useRemoteConfig;
