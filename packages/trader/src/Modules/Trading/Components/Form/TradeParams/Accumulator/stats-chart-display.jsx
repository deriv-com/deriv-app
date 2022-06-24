import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { connect } from 'Stores/connect';
import { Text } from '@deriv/components';
import classNames from 'classnames';

const StatsChartDisplay = ({ tick_size_barrier, ticks_count_since_loss_condition = 13 }) => {
    return (
        <Fieldset className={classNames('trade-container__fieldset', 'trade-container__fieldset--stats-chart-display')}>
            <Text size='xxs' align='center'>
                {localize('The last tick that exceeded {{tick_size_barrier}}%:', {
                    tick_size_barrier: tick_size_barrier.toFixed(5),
                })}
            </Text>
            <Text size='xs' weight='bold'>
                {localize('{{ticks_count_since_loss_condition}} ticks ago', {
                    ticks_count_since_loss_condition,
                })}
            </Text>
        </Fieldset>
    );
};

StatsChartDisplay.propTypes = {
    tick_size_barrier: PropTypes.number,
    ticks_count_since_loss_condition: PropTypes.number,
};

export default connect(({ modules }) => ({
    // TODO: when API is ready, connect real ticks_count_since_loss_condition
    tick_size_barrier: modules.trade.tick_size_barrier,
}))(StatsChartDisplay);
