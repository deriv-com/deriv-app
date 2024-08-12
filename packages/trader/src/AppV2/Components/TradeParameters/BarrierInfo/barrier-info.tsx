import React from 'react';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { Skeleton, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import clsx from 'clsx';

const BarrierInfo = observer(({ is_minimized }: { is_minimized?: boolean }) => {
    const { barrier_1 } = useTraderStore();

    return (
        <div
            className={clsx('barrier-info__container', {
                'barrier-info__container--isHidden': is_minimized,
            })}
        >
            <Text size='sm'>
                <Localize i18n_default_text='Barrier' />
            </Text>
            {barrier_1 ? (
                <Text size='sm' bold>
                    {barrier_1}
                </Text>
            ) : (
                <Skeleton.Square />
            )}
        </div>
    );
});

export default BarrierInfo;
