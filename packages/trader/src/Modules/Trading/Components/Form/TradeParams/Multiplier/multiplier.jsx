import React from 'react';
import { Dropdown } from '@deriv/components';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer } from '@deriv/stores';

const Multiplier = observer(() => {
    const { multiplier, multiplier_range_list, onChange } = useTraderStore();
    return (
        <Dropdown
            id='multiplier'
            className='trade-container__multiplier-dropdown'
            is_alignment_left
            is_nativepicker={false}
            list={multiplier_range_list}
            name='multiplier'
            no_border={true}
            value={multiplier}
            onChange={onChange}
        />
    );
});

export default Multiplier;
