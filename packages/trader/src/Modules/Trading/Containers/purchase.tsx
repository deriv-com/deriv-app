import React from 'react';
import { getContractTypePosition, getSupportedContracts, isAccumulatorContract, isEmptyObject } from '@deriv/shared';
import { localize } from '@deriv/translations';
import PurchaseButtonsOverlay from 'Modules/Trading/Components/Elements/purchase-buttons-overlay.jsx';
import PurchaseFieldset from 'Modules/Trading/Components/Elements/purchase-fieldset';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer, useStore } from '@deriv/stores';
import { TProposalTypeInfo } from 'Types';

type TGetSupportedContractsKey = keyof ReturnType<typeof getSupportedContracts>;

const getSortedIndex = (type: string, index: number) => {
    switch (getContractTypePosition(type as TGetSupportedContractsKey)) {
        case 'top':
            return 0;
        case 'bottom':
            return 1;
        default:
            return index;
    }
};

const Purchase = observer(({ is_market_closed }: { is_market_closed: boolean }) => {
    const {
        portfolio: { active_positions },
        ui: { purchase_states: purchased_states_arr, is_mobile, setPurchaseState },
    } = useStore();
    const {
        basis,
        contract_type,
        currency,
        is_accumulator,
        is_multiplier,
        growth_rate,
        has_cancellation,
        is_purchase_enabled,
        is_turbos,
        is_vanilla,
        onPurchase: onClickPurchase,
        onHoverPurchase,
        proposal_info,
        purchase_info,
        symbol,
        validation_errors = {},
        vanilla_trade_type,
        trade_types,
        is_trade_enabled,
    } = useTraderStore();

    const is_high_low = /^high_low$/.test(contract_type.toLowerCase());
    const isLoading = (info: TProposalTypeInfo | Record<string, never>) => {
        const has_validation_error = Object.values(validation_errors).some(e => e.length);
        return !has_validation_error && !info?.has_error && !info.id;
    };
    const is_proposal_empty = isEmptyObject(proposal_info);
    const components = [];

    Object.keys(trade_types).forEach((type, index) => {
        const info = proposal_info?.[type] || {};
        const is_disabled = !is_trade_enabled || !info.id || !is_purchase_enabled;
        const is_accum_or_mult_error = info?.has_error && !!info?.message;
        const is_proposal_error =
            is_multiplier || (is_accumulator && !is_mobile) ? is_accum_or_mult_error : info?.has_error;
        const purchase_fieldset = (
            <PurchaseFieldset
                basis={basis}
                buy_info={purchase_info}
                currency={currency}
                growth_rate={growth_rate}
                info={info}
                key={type}
                index={getSortedIndex(type, index)}
                has_cancellation={has_cancellation}
                is_accumulator={is_accumulator}
                is_disabled={is_disabled}
                is_high_low={is_high_low}
                is_loading={isLoading(info)}
                is_market_closed={is_market_closed}
                is_multiplier={is_multiplier}
                is_turbos={is_turbos}
                is_vanilla={is_vanilla}
                is_proposal_empty={is_proposal_empty}
                is_proposal_error={!!is_proposal_error}
                purchased_states_arr={purchased_states_arr}
                onHoverPurchase={onHoverPurchase}
                onClickPurchase={onClickPurchase}
                setPurchaseState={setPurchaseState}
                type={type}
            />
        );

        if (!is_vanilla && getContractTypePosition(type as TGetSupportedContractsKey) === 'top') {
            components.unshift(purchase_fieldset);
        } else if (
            (!is_vanilla && getContractTypePosition(type as TGetSupportedContractsKey) !== 'top') ||
            vanilla_trade_type === type
        ) {
            components.push(purchase_fieldset);
        }
    });

    const should_disable_accu_purchase =
        is_accumulator &&
        !!active_positions.find(
            ({ contract_info, type }) => isAccumulatorContract(type) && contract_info.underlying === symbol
        );

    if (should_disable_accu_purchase) {
        components.unshift(
            <PurchaseButtonsOverlay
                is_to_cover_one_button={components.length === 1}
                key='overlay'
                message={localize('You can only purchase one contract at a time')}
            />
        );
    }

    return components as unknown as JSX.Element;
});

export default Purchase;
