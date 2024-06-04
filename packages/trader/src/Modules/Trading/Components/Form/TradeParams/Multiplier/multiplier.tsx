import React from 'react';
import { Dropdown } from '@deriv/components';
import { TRADE_TYPES } from '@deriv/shared';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer } from '@deriv/stores';

const Multiplier = observer(() => {
    const { multiplier, multiplier_range_list, onChange } = useTraderStore();
    return (
        <Dropdown
            test_id={TRADE_TYPES.MULTIPLIER}
            className='trade-container__multiplier-dropdown'
            is_alignment_left
            list={multiplier_range_list as unknown as React.ComponentProps<typeof Dropdown>['list']}
            name={TRADE_TYPES.MULTIPLIER}
            no_border
            value={multiplier}
            onChange={onChange}
        />
    );
});

export default Multiplier;
