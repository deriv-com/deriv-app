import classNames from 'classnames';
import React from 'react';
import { Money, Text, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { observer, useStore } from '@deriv/stores';

const PayoutPerPoint = observer(() => {
    const {
        modules: { trade },
    } = useStore();
    const { currency, proposal_info, contract_type } = trade;
    const label = localize('Payout per point');
    const contract_key = contract_type?.toUpperCase();
    const stake = proposal_info?.[contract_key]?.number_of_contracts || 0;
    const message = proposal_info?.[contract_key]?.message || ' ';

    return (
        <Fieldset className={classNames('payout-per-point')}>
            <div className='payout-per-point__text-popover'>
                <Text size='xs' color='less-prominent' className='payout-per-point__text'>
                    {label}
                </Text>
                <Popover
                    alignment='top'
                    icon='info'
                    is_bubble_hover_enabled
                    margin={0}
                    zIndex='9999'
                    message={message}
                />
            </div>
            <Text size='xs' weight='bold' className='payout-per-point__currency'>
                <Money amount={stake} currency={currency} show_currency />
            </Text>
        </Fieldset>
    );
});

export default PayoutPerPoint;
