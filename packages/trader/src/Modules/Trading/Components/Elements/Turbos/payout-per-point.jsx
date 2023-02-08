import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Money, Text, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { connect } from 'Stores/connect';

const PayoutPerPoint = ({ currency, proposal_info, contract_type }) => {
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
                    zIndex={9999}
                    message={message}
                />
            </div>
            <Text size='xxs' weight='bold' className='payout-per-point__currency'>
                <Money amount={stake} currency={currency} show_currency />
            </Text>
        </Fieldset>
    );
};

PayoutPerPoint.propTypes = {
    currency: PropTypes.string,
    proposal_info: PropTypes.object,
    contract_type: PropTypes.string,
};

export default connect(({ modules }) => ({
    currency: modules.trade.currency,
    proposal_info: modules.trade.proposal_info,
    contract_type: modules.trade.contract_type,
}))(PayoutPerPoint);
