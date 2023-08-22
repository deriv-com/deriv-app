import React from 'react';
import { isAccumulatorContract, isEmptyObject, isOpen, hasContractEntered, getIndicativePrice } from '@deriv/shared';
import AccumulatorsSellButton from '../Components/Form/TradeParams/Accumulator/accumulators-sell-button';
import PurchaseFieldset from 'Modules/Trading/Components/Elements/purchase-fieldset.jsx';
import { getContractTypePosition } from 'Constants/contract';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer, useStore } from '@deriv/stores';

const Purchase = observer(({ is_market_closed }) => {
    const {
        portfolio: { all_positions, onClickSell },
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
        validation_errors,
        vanilla_trade_type,
        trade_types,
        is_trade_enabled,
        has_open_accu_contract,
    } = useTraderStore();
    const is_high_low = /^high_low$/.test(contract_type.toLowerCase());
    const isLoading = info => {
        const has_validation_error = Object.values(validation_errors).some(e => e.length);
        return !has_validation_error && !info.has_error && !info.id;
    };
    const is_proposal_empty = isEmptyObject(proposal_info);
    const active_accu_contract =
        is_accumulator &&
        all_positions.find(
            ({ contract_info, type }) =>
                isAccumulatorContract(type) && contract_info.underlying === symbol && !contract_info.is_sold
        );
    const is_valid_to_sell = active_accu_contract?.contract_info
        ? hasContractEntered(active_accu_contract.contract_info) && isOpen(active_accu_contract.contract_info)
        : false;
    const indicative = (is_valid_to_sell && getIndicativePrice(active_accu_contract?.contract_info)) || null;
    const onClickSellButton = e => {
        onClickSell?.(active_accu_contract.contract_info.contract_id);
        e.stopPropagation();
        e.preventDefault();
    };

    const components = [];
    Object.keys(trade_types).map((type, index) => {
        const getSortedIndex = () => {
            if (getContractTypePosition(type) === 'top') return 0;
            if (getContractTypePosition(type) === 'bottom') return 1;
            return index;
        };
        const info = proposal_info[type] || {};
        const is_disabled = !is_trade_enabled || !info.id || !is_purchase_enabled;
        const is_proposal_error =
            is_multiplier || (is_accumulator && !is_mobile) ? info.has_error && !!info.message : info.has_error;
        const purchase_fieldset = (
            <PurchaseFieldset
                basis={basis}
                buy_info={purchase_info}
                currency={currency}
                growth_rate={growth_rate}
                info={info}
                key={index}
                index={getSortedIndex(index, type)}
                has_cancellation={has_cancellation}
                is_accumulator={is_accumulator}
                is_disabled={is_disabled}
                is_high_low={is_high_low}
                is_loading={isLoading(info)}
                is_market_closed={is_market_closed}
                is_mobile={is_mobile}
                is_multiplier={is_multiplier}
                is_turbos={is_turbos}
                is_vanilla={is_vanilla}
                is_proposal_empty={is_proposal_empty}
                is_proposal_error={is_proposal_error}
                purchased_states_arr={purchased_states_arr}
                onHoverPurchase={onHoverPurchase}
                onClickPurchase={onClickPurchase}
                setPurchaseState={setPurchaseState}
                type={type}
            />
        );

        if (!is_vanilla && (!is_accumulator || !has_open_accu_contract)) {
            switch (getContractTypePosition(type)) {
                case 'top':
                    components.unshift(purchase_fieldset);
                    break;
                case 'bottom':
                    components.push(purchase_fieldset);
                    break;
                default:
                    components.push(purchase_fieldset);
                    break;
            }
        } else if (vanilla_trade_type === type) {
            components.push(purchase_fieldset);
        } else if (is_accumulator && has_open_accu_contract) {
            components.push(
                <AccumulatorsSellButton
                    is_disabled={!is_valid_to_sell}
                    onClick={onClickSellButton}
                    contract_info={active_accu_contract?.contract_info}
                    is_sell_requested={active_accu_contract?.is_sell_requested}
                    current_stake={indicative}
                    currency={currency}
                />
            );
        }
    });

    return components;
});

export default Purchase;
