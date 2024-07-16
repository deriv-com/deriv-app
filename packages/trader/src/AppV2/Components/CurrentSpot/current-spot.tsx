import React from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { Text } from '@deriv-com/quill-ui';
import { useTraderStore } from 'Stores/useTraderStores';
import { Skeleton } from '@deriv/components';

type TCurrentSpotProps = {
    className?: string;
};

const CurrentSpot = observer(({ className }: TCurrentSpotProps) => {
    const { symbol, resetTickData, tick_data } = useTraderStore();
    const { current_spot, pip_size } = tick_data ?? {};
    const spot = current_spot?.toFixed(pip_size);
    /* TODO: add animation with gradual transition from prev_spot to the current spot:
    const prev_spot = React.useRef(spot); */

    React.useEffect(() => {
        // TODO: move this logic to Assets feature when it's available:
        resetTickData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symbol]);

    return (
        <div className={clsx('trade__current-spot', className)}>
            {current_spot ? (
                <Text size='xl' bold>
                    {spot}
                </Text>
            ) : (
                <Skeleton width={133} height={32} />
            )}
        </div>
    );
});

export default CurrentSpot;
