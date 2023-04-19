import React from 'react';
import { localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { Money, Text } from '@deriv/components';
import classNames from 'classnames';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const AccumulatorsInfoDisplay = observer(() => {
    const { currency, maximum_payout, maximum_ticks } = useTraderStore();

    const labels = [localize('Maximum payout'), localize('Maximum ticks')].map((label, index) => (
        <Text key={index} size='xxs' weight='bold'>
            {label}
        </Text>
    ));

    const values = [
        <Money key={0} amount={maximum_payout} show_currency currency={currency} />,
        localize('{{maximum_ticks}} {{ticks}}', {
            maximum_ticks,
            ticks: maximum_ticks === 1 ? 'tick' : 'ticks',
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
});

export default AccumulatorsInfoDisplay;
