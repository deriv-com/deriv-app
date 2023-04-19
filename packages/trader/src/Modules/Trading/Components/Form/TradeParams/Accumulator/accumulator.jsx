import React from 'react';
import { localize } from '@deriv/translations';
import NumberSelector from 'App/Components/Form/number-selector.jsx';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { getGrowthRatePercentage, getTickSizeBarrierPercentage } from '@deriv/shared';
import classNames from 'classnames';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const Accumulator = observer(() => {
    const { accumulator_range_list, growth_rate, onChange, tick_size_barrier } = useTraderStore();
    // splitting accumulator_range_list into rows containing 5 values each:
    const arr_arr_numbers = accumulator_range_list.reduce((acc, _el, index) => {
        if (index % 5 === 0) {
            acc.push(accumulator_range_list.slice(index, index + 5));
        }
        return acc;
    }, []);

    if (!accumulator_range_list.length) return null;
    return (
        <Fieldset
            className={classNames('trade-container__fieldset', 'accumulator')}
            header={localize('Accumulate')}
            is_center
            header_tooltip={localize(
                'Your stake will grow by {{growth_rate}}% at every tick starting from the second tick, as long as the price remains within a range of ±{{tick_size_barrier}} from the previous tick price.',
                {
                    growth_rate: getGrowthRatePercentage(growth_rate),
                    tick_size_barrier: getTickSizeBarrierPercentage(tick_size_barrier),
                }
            )}
        >
            <NumberSelector
                arr_arr_numbers={arr_arr_numbers}
                name='growth_rate'
                onChange={onChange}
                selected_number={growth_rate}
                should_show_in_percents
            />
        </Fieldset>
    );
});

export default Accumulator;
