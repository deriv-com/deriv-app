import React from 'react';
import { Icon, Money, Text, Popover } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset';
import { observer } from '@deriv/stores';
import { getContractSubtype, isVanillaContract } from '@deriv/shared';
import { useTraderStore } from 'Stores/useTraderStores';
import { TProposalTypeInfo } from 'Types';

type TProposalInfo = {
    [key: string]: TProposalTypeInfo;
};

const PayoutPerPointMobile = observer(() => {
    const { currency, proposal_info, contract_type } = useTraderStore();
    const contract_key = contract_type?.toUpperCase();
    // remove assertion and local TProposalInfo type after TS migration for trade package is complete
    const { has_error, has_increased, id, message, obj_contract_basis } =
        (proposal_info as TProposalInfo)?.[contract_key] || {};
    const { text: label, value: payout_per_point } = obj_contract_basis || {};
    const has_error_or_not_loaded = has_error || !id;
    const turbos_titles = {
        Long: localize('For Long:'),
        Short: localize('For Short:'),
    };
    const tooltip_text = isVanillaContract(contract_type) ? (
        <Localize i18n_default_text='The payout at expiry is equal to the payout per point multiplied by the difference between the final price and the strike price.' />
    ) : (
        <Localize
            i18n_default_text='<0>{{title}}</0> {{message}}'
            components={[<Text key={0} weight='bold' size='xxs' />]}
            values={{
                title: turbos_titles[getContractSubtype(contract_key) as keyof typeof turbos_titles],
                message,
            }}
        />
    );
    if (!payout_per_point) return <Fieldset className='payout-per-point' />;
    return (
        <Fieldset className='payout-per-point'>
            <div className='payout-per-point__label-wrapper'>
                <Text size='xs' color='less-prominent' className='payout-per-point__label'>
                    {label}
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
