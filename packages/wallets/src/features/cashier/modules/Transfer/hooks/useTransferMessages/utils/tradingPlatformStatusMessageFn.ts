import { TRADING_PLATFORM_STATUS } from '../../../../../../cfd/constants';
import { TMessageFnProps } from '../../../types';

const tradingPlatformStatusMessageFn = ({ platformStatus }: TMessageFnProps) => {
    const getStatusBadgeText = () => {
        if (!platformStatus) return;
        if (platformStatus === TRADING_PLATFORM_STATUS.MAINTENANCE) {
            return 'We’re currently performing server maintenance, which may continue until 03:00 GMT. Please expect some disruptions during this time.';
        }
        return 'The server is temporarily unavailable for this account. We’re working to resolve this.';
    };
    return {
        message: { text: getStatusBadgeText(), values: {} },
        type: 'warning' as const,
    };
};

export default tradingPlatformStatusMessageFn;
