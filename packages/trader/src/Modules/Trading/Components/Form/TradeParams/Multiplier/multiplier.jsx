import React from 'react';
import { Dropdown } from '@deriv/components';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer, useStore } from '@deriv/stores';
import { showLabelForMultipliers } from '../../../../Helpers/contract-type';

const Multiplier = observer(() => {
    const { multiplier, multiplier_range_list, onChange, symbol } = useTraderStore();
    const {
        active_symbols: { active_symbols },
    } = useStore();
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
            should_show_new_label={showLabelForMultipliers(symbol, active_symbols)}
        />
    );
});

export default Multiplier;
