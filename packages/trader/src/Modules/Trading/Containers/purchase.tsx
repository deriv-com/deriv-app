import React from 'react';
import {
    isAccumulatorContract,
    isEmptyObject,
    isOpen,
    hasContractEntered,
    getContractTypePosition,
    getSupportedContracts,
    getIndicativePrice,
} from '@deriv/shared';
import AccumulatorsSellButton from '../Components/Form/TradeParams/Accumulator/accumulators-sell-button';
import PurchaseFieldset from 'Modules/Trading/Components/Elements/purchase-fieldset';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer, useStore } from '@deriv/stores';
import { TTradeStore } from 'Types';

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

const Purchase = observer(({ is_market_closed }: { is_market_closed?: boolean }) => {
    const {
        portfolio: { all_positions, onClickSell },
        ui: {
            purchase_states: purchased_states_arr,
            is_mobile,
            setPurchaseState,
            setIsTradingDisabledByResidenceModal,
        },
        client: { is_account_to_be_closed_by_residence },
    } = useStore();
    const {
        basis,
        contract_type,
        currency,
        growth_rate,
        has_cancellation,
        has_open_accu_contract,
        is_accumulator,
        is_multiplier,
        is_purchase_enabled,
        is_trade_enabled,
        is_turbos,
        is_vanilla_fx,
        is_vanilla,
        onHoverPurchase,
        onPurchase,
        proposal_info,
        purchase_info,
        symbol,
        trade_types,
        validation_errors,
    } = useTraderStore();

    const is_high_low = /^high_low$/.test(contract_type.toLowerCase());
    const isLoading = (info: TTradeStore['proposal_info'][string] | Record<string, never>) => {
        const has_validation_error = Object.values(validation_errors).some(e => e.length);
        return !has_validation_error && !info?.has_error && !info.id;
    };
    const is_proposal_empty = isEmptyObject(proposal_info);
    const active_accu_contract = is_accumulator
        ? all_positions.find(
              ({ contract_info, type }) =>
                  isAccumulatorContract(type) && contract_info.underlying === symbol && !contract_info.is_sold
          )
        : undefined;
    const is_valid_to_sell = active_accu_contract?.contract_info
        ? hasContractEntered(active_accu_contract.contract_info) && isOpen(active_accu_contract.contract_info)
        : false;
    const indicative =
        (is_valid_to_sell && active_accu_contract && getIndicativePrice(active_accu_contract.contract_info)) || null;
    const onClickSellButton = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (active_accu_contract && onClickSell) {
            onClickSell(active_accu_contract.contract_info.contract_id);
            e.stopPropagation();
            e.preventDefault();
        }
    };

    const components: JSX.Element[] = [];

    const onClickPurchase = is_account_to_be_closed_by_residence
        ? () => setIsTradingDisabledByResidenceModal(true)
        : onPurchase;

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
                info={info}
                key={type}
                index={getSortedIndex(type, index)}
                growth_rate={growth_rate}
                has_cancellation={has_cancellation}
                is_accumulator={is_accumulator}
                is_disabled={is_disabled}
                is_high_low={is_high_low}
                is_loading={isLoading(info)}
                is_market_closed={is_market_closed}
                is_multiplier={is_multiplier}
                is_turbos={is_turbos}
                is_vanilla={is_vanilla}
                is_vanilla_fx={is_vanilla_fx}
                is_proposal_empty={is_proposal_empty}
                is_proposal_error={!!is_proposal_error}
                purchased_states_arr={purchased_states_arr}
                onHoverPurchase={onHoverPurchase}
                onClickPurchase={onClickPurchase}
                setPurchaseState={setPurchaseState}
                type={type}
            />
        );

        if (!is_vanilla && (!is_accumulator || !has_open_accu_contract)) {
            switch (getContractTypePosition(type as TGetSupportedContractsKey)) {
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
        } else if (contract_type.toUpperCase() === type) {
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
                    key={type}
                />
            );
        }
    });

    return components as unknown as JSX.Element;
});

export default Purchase;
