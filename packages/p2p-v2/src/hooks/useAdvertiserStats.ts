import { useAdvertiserInfo } from '@deriv/api';

export const useAdvertiserStats = (advertiserId?: number) => {
    const { data, isSuccess } = useAdvertiserInfo(advertiserId);
};
