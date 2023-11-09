import React from 'react';
import { Dropdown } from '@deriv/components';
import { TRADE_TYPES } from '@deriv/shared';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer } from '@deriv/stores';
import { showLabelForMultipliers } from '../../../../Helpers/contract-type';

const Multiplier = observer(() => {
    const { multiplier, multiplier_range_list, onChange, symbol } = useTraderStore();
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
            should_show_new_label={showLabelForMultipliers(symbol)}
        />
    );
});

export default Multiplier;
