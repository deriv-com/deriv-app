import React from 'react';
import { localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { connect } from 'Stores/connect';
import { Money, Text } from '@deriv/components';
import classNames from 'classnames';
import { TCoreStores } from '@deriv/stores/types';
import { Proposal } from '@deriv/api-types';

type TAccumulatorsInfoDisplay = Pick<NonNullable<Proposal['contract_details']>, 'maximum_payout' | 'maximum_ticks'> & {
    currency?: string;
};

const AccumulatorsInfoDisplay = ({ currency, maximum_payout, maximum_ticks }: TAccumulatorsInfoDisplay) => {
    const content = [
        {
            label: localize('Maximum payout'),
            value: <Money amount={maximum_payout} show_currency currency={currency} />,
        },
        {
            label: localize('Maximum ticks'),
            value: `${maximum_ticks || 0} ${maximum_ticks === 1 ? localize('tick') : localize('ticks')}`,
        },
    ];

    return (
        <Fieldset className={classNames('trade-container__fieldset', 'accu-info-display')}>
            {content.map(({ label, value }) => (
                <div key={label} className='accu-info-display__row'>
                    <Text size='xxs' weight='bold' line_height='xxs'>
                        {label}
                    </Text>
                    <Text size='xxs' align='right'>
                        {value}
                    </Text>
                </div>
            ))}
        </Fieldset>
    );
};

export default connect(({ modules }: TCoreStores) => ({
    currency: modules.trade.currency,
    maximum_payout: modules.trade.maximum_payout,
    maximum_ticks: modules.trade.maximum_ticks,
}))(AccumulatorsInfoDisplay);
