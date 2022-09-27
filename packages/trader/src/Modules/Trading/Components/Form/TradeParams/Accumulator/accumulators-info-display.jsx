import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { connect } from 'Stores/connect';
import { Money, Text } from '@deriv/components';
import classNames from 'classnames';

const AccumulatorsInfoDisplay = ({ currency, max_payout, max_ticks_number }) => {
    const labels = [localize('Maximum payout'), localize('Maximum ticks')].map((label, index) => (
        <Text key={index} size='xxs' weight='bold'>
            {label}
        </Text>
    ));

    const values = [
        <Money key={0} amount={max_payout} show_currency currency={currency} />,
        localize('{{max_ticks_number}} {{ticks}}', {
            max_ticks_number,
            ticks: max_ticks_number === 1 ? 'tick' : 'ticks',
        }),
    ].map((value_component, index) => (
        <Text key={index} size='xxs' align='right'>
            {value_component}
        </Text>
    ));

    return (
        <Fieldset className={classNames('trade-container__fieldset', 'accu-info-display')}>
            {[labels, values].map((text, index) => (
                <div key={index} className='accu-info-display__column'>
                    {text}
                </div>
            ))}
        </Fieldset>
    );
};

AccumulatorsInfoDisplay.propTypes = {
    currency: PropTypes.string,
    max_payout: PropTypes.number,
    max_ticks_number: PropTypes.number,
};

export default connect(({ modules }) => ({
    currency: modules.trade.currency,
    max_ticks_number: modules.trade.max_ticks_number,
    max_payout: modules.trade.max_payout,
}))(AccumulatorsInfoDisplay);
