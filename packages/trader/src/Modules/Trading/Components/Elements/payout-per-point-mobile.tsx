import classNames from 'classnames';
import React from 'react';
import { Icon, Money, Text, Popover } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { observer, useStore } from '@deriv/stores';
import { getContractSubtype, isVanillaContract } from '@deriv/shared';

const PayoutPerPointMobile = observer(() => {
    const {
        modules: { trade },
    } = useStore();
    const { currency, proposal_info, contract_type, vanilla_trade_type } = trade;
    const contract_key = isVanillaContract(contract_type) ? vanilla_trade_type : contract_type?.toUpperCase();
    const { has_error, has_increased, id, message, obj_contract_basis } = proposal_info?.[contract_key] || {};
    const { text: label, value: payout_per_point = 0 } = obj_contract_basis || {};
    const has_error_or_not_loaded = has_error || !id;
    const tooltip_text = (
        <Localize
            i18n_default_text='<0>For {{title}}: </0>{{message}}'
            components={[<Text key={0} weight='bold' size='xxs' />]}
            values={{
                title: getContractSubtype(contract_key),
                message,
            }}
        />
    );

    return (
        <Fieldset className={classNames('payout-per-point')}>
            <div className='payout-per-point__label-wrapper'>
                <Text size='xs' color='less-prominent' className='payout-per-point__label'>
                    {localize('{{label}}', { label })}
                </Text>
                <Popover
                    alignment='top'
                    icon='info'
                    is_bubble_hover_enabled
                    margin={0}
                    zIndex='9999'
                    message={message ? tooltip_text : ''}
                />
            </div>
            <Text size='xs' weight='bold' className='payout-per-point__value'>
                <Money amount={payout_per_point} currency={currency} show_currency should_format={false} />
                <span className='trade-container__price-info-movement'>
                    {!has_error_or_not_loaded && has_increased !== null && has_increased ? (
                        <Icon icon='IcProfit' />
                    ) : (
                        <Icon icon='IcLoss' />
                    )}
                </span>
            </Text>
        </Fieldset>
    );
});

export default PayoutPerPointMobile;
