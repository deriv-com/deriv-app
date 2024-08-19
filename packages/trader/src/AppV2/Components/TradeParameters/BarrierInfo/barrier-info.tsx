import React from 'react';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';

const BarrierInfo = observer(() => {
    const { barrier_1 } = useTraderStore();

    return (
        <div className='barrier-info__container'>
            <Text size='sm'>
                <Localize i18n_default_text='Barrier' />
            </Text>
            <Text size='sm' bold>
                {barrier_1}
            </Text>
        </div>
    );
});

export default BarrierInfo;
