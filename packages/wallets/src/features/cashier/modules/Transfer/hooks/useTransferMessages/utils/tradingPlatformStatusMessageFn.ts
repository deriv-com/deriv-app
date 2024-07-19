import { TMessageFnProps } from '../../../types';

const tradingPlatformStatusMessageFn = ({ platformStatus }: TMessageFnProps) => {
    return {
        message: { text: platformStatus, values: {} },
        type: 'warning' as const,
    };
};

export default tradingPlatformStatusMessageFn;
