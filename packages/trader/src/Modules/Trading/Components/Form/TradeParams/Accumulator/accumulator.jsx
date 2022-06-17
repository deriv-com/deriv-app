import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import NumberSelector from 'App/Components/Form/number-selector.jsx';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { connect } from 'Stores/connect';

const Accumulator = ({ accumulator_rates_list, growth_rate, onChange }) => {
    return (
        <Fieldset className='trade-container__fieldset' header={localize('Accumulator')} is_center>
            <NumberSelector
                arr_arr_numbers={[accumulator_rates_list]}
                name='growth_rate'
                onChange={onChange}
                selected_number={growth_rate}
                show_in_percentage
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
