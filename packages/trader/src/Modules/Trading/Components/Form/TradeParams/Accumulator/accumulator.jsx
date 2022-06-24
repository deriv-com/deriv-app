import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import NumberSelector from 'App/Components/Form/number-selector.jsx';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { connect } from 'Stores/connect';
import { AccumulatorsInfo } from '../info.jsx';

const Accumulator = ({ accumulator_rates_list, growth_rate, onChange }) => {
    // splitting accumulator_rates_list into rows containing 5 values each:
    const arr_arr_numbers = accumulator_rates_list.reduce((acc, _el, index) => {
        if (index % 5 === 0) {
            acc.push(accumulator_rates_list.slice(index, index + 5));
        }
        return acc;
    }, []);

    return (
        <Fieldset
            className='trade-container__fieldset'
            header={localize('Accumulator')}
            is_center
            header_tooltip={localize(
                'Your payout will grow by {{growth_rate}}% at every tick, as long as the price change doesn’t exceed ± 0.1% of the previous tick.',
                {
                    growth_rate: growth_rate * 100,
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
            <AccumulatorsInfo
                className='trade-container__accumulators-trade-info'
                is_accumulators_info
                should_show_tooltip
                is_tooltip_relative
            />
        </Fieldset>
    );
};

Accumulator.propTypes = {
    accumulator_rates_list: MobxPropTypes.arrayOrObservableArray,
    growth_rate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
};

export default connect(({ modules }) => ({
    accumulator_rates_list: modules.trade.accumulator_rates_list,
    growth_rate: modules.trade.growth_rate,
    onChange: modules.trade.onChange,
}))(Accumulator);
