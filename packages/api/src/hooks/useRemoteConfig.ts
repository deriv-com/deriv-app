import { useEffect, useRef, useState } from 'react';
import { ObjectUtils } from '@deriv-com/utils';
import initData from '../remote_config.json';

const remoteConfigQuery = async function () {
    const isProductionOrStaging = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';
    const REMOTE_CONFIG_URL = process.env.REMOTE_CONFIG_URL || '';
    if (isProductionOrStaging && REMOTE_CONFIG_URL === '') {
        throw new Error('Remote Config URL is not set!');
    }
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
