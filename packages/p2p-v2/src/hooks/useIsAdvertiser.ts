import { useEffect, useState } from 'react';
import { ERROR_CODES } from '@/constants';
import { useAdvertiserInfoState } from '@/providers/AdvertiserInfoStateProvider';

const useIsAdvertiser = () => {
    const [isAdvertiser, setIsAdvertiser] = useState(false);
    const { error } = useAdvertiserInfoState();

    useEffect(() => {
        if (error && error.code === ERROR_CODES.ADVERTISER_NOT_FOUND) {
            setIsAdvertiser(false);
        } else if (!error) {
            setIsAdvertiser(true);
        }
    }, [error]);

    return isAdvertiser;
};

export default useIsAdvertiser;
