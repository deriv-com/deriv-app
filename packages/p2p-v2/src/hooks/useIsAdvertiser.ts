import { useEffect, useState } from 'react';
import { ERROR_CODES } from '@/constants';
import { isEmptyObject } from '@/utils';
import { p2p } from '@deriv/api-v2';

/**
 * Custom hook to check if the current user is an advertiser.
 * @returns {boolean} isAdvertiser - True if the current user is an advertiser, false otherwise.
 */
const useIsAdvertiser = (): boolean => {
    const { data, error } = p2p.advertiser.useGetInfo();
    const [isAdvertiser, setIsAdvertiser] = useState(!error && !isEmptyObject(data));

    useEffect(() => {
        if (error && error.code === ERROR_CODES.ADVERTISER_NOT_FOUND) {
            setIsAdvertiser(false);
        } else if (!error && !isEmptyObject(data)) {
            setIsAdvertiser(true);
        }
    }, [data, error]);

    return isAdvertiser;
};

export default useIsAdvertiser;
