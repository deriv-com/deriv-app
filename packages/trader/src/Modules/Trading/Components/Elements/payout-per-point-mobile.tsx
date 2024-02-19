import React from 'react';
import { ArrowIndicator, Money, Text, Popover } from '@deriv/components';
import { Localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset';
import { observer } from '@deriv/stores';
import { getContractSubtype, getLocalizedBasis } from '@deriv/shared';
import { useTraderStore } from 'Stores/useTraderStores';
import { TProposalTypeInfo, TTradeStore } from 'Types';

type TProposalInfo = {
    [key: string]: TProposalTypeInfo;
};

const PayoutPerPointMobile = observer(() => {
    const {
        barrier_1,
        currency,
        proposal_info,
        contract_type,
        is_vanilla,
        is_vanilla_fx,
        onChange,
        short_barriers,
        long_barriers,
        strike_price_choices,
    } = useTraderStore();
    const contract_key = contract_type?.toUpperCase();
    // remove assertion and local TProposalInfo type after TS migration for trade package is complete
    const { message, obj_contract_basis } = (proposal_info as TProposalInfo)?.[contract_key] || {};
    const { text: label, value: payout_per_point } = obj_contract_basis || {};
    const turbos_payout_message = (
        <Localize i18n_default_text='This is the amount you’ll receive at expiry for every point of change in the underlying price, if the spot price never touches or breaches the barrier throughout the contract duration.' />
    );
    const vanilla_payout_message = is_vanilla_fx ? (
        <Localize
            i18n_default_text='The payout at expiry is equal to the payout per pip multiplied by the difference, <0>in pips</0>, between the final price and the strike price.'
            components={[<strong key={0} />]}
        />
    ) : (
        <Localize i18n_default_text='The payout at expiry is equal to the payout per point multiplied by the difference between the final price and the strike price.' />
    );
    const tooltip_text = is_vanilla ? vanilla_payout_message : turbos_payout_message;
    let stored_barriers_data: TTradeStore['short_barriers' | 'long_barriers' | 'strike_price_choices'];
    switch (getContractSubtype(contract_type)) {
        case 'Short':
            stored_barriers_data = short_barriers;
            break;
        case 'Long':
            stored_barriers_data = long_barriers;
            break;
        case 'Call':
        case 'Put':
            stored_barriers_data = strike_price_choices;
            break;
        default:
            stored_barriers_data = {};
    }
    const length = stored_barriers_data.barrier_choices.length;
    const index = stored_barriers_data.barrier_choices.indexOf(barrier_1);
    const clickUp = () => {
        if (index + 1 < length) {
            onChange({
                target: {
                    name: 'barrier_1',
                    value: stored_barriers_data.barrier_choices[index + 1],
                },
            });
        }
    };
    const clickDown = () => {
        if (index - 1 >= 0) {
            onChange({
                target: {
                    name: 'barrier_1',
                    value: stored_barriers_data.barrier_choices[index - 1],
                },
            });
        }
    };
    if (!payout_per_point) return <Fieldset className='payout-per-point' />;
    return (
        <Fieldset className='payout-per-point'>
            <div className='payout-per-point__label-wrapper'>
                <Text size='xs' color='less-prominent' className='payout-per-point__label'>
                    {is_vanilla_fx ? getLocalizedBasis().payout_per_pip : label}
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
                {/* increasing the barrier value means reducing PPP, hence vise-versa logic */}
                <button onClick={clickDown} disabled={index - 1 < 0}>
                    ▲
                </button>
                <Money amount={payout_per_point} currency={currency} show_currency should_format={false} />
                <ArrowIndicator className='trade-container__price-info-movement' value={payout_per_point} />
                <button onClick={clickUp} disabled={index + 1 >= length}>
                    ▼
                </button>
            </Text>
        </Fieldset>
    );
});

export default PayoutPerPointMobile;
