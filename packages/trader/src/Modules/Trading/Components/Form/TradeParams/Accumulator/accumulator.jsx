import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import NumberSelector from 'App/Components/Form/number-selector.jsx';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { connect } from 'Stores/connect';
import { getGrowthRatePercentage, getTickSizeBarrierPercentage } from '@deriv/shared';
import classNames from 'classnames';

const Accumulator = ({ accumulator_range_list, growth_rate, onChange, tick_size_barrier }) => {
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
};

Accumulator.propTypes = {
    accumulator_range_list: MobxPropTypes.arrayOrObservableArray,
    growth_rate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
    tick_size_barrier: PropTypes.number,
};

export default connect(({ modules }) => ({
    accumulator_range_list: modules.trade.accumulator_range_list,
    growth_rate: modules.trade.growth_rate,
    onChange: modules.trade.onChange,
    tick_size_barrier: modules.trade.tick_size_barrier,
}))(Accumulator);
