import React from 'react';
import classNames from 'classnames';
import { isAccumulatorContract, isEmptyObject, getCardLabels } from '@deriv/shared';
import { Button } from '@deriv/components';
import PurchaseFieldset from 'Modules/Trading/Components/Elements/purchase-fieldset.jsx';
import { getContractTypePosition } from 'Constants/contract';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer, useStore } from '@deriv/stores';

const Purchase = observer(({ is_market_closed }) => {
    const {
        portfolio: { active_positions, onClickSell, is_sell_requested },
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

    const test =
        is_accumulator &&
        active_positions.find(
            ({ contract_info, type }) => isAccumulatorContract(type) && contract_info.underlying === symbol
        );
    const onClickSellButton = e => {
        onClickSell?.(test.contract_info.contract_id);
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

        const sell_button = (
            <Button
                className={classNames('dc-btn--sell', {
                    'dc-btn--loading': false,
                })}
                is_disabled={is_sell_requested}
                text={getCardLabels().SELL}
                onClick={onClickSellButton}
                secondary
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
            components.push(sell_button);
        }
    });

    // if (should_disable_accu_purchase) {
    //     components.unshift(
    // <PurchaseButtonsOverlay
    //     is_to_cover_one_button={components.length === 1}
    //     key='overlay'
    //     message={
    //         <React.Fragment>
    //             {localize('Sell')} <Money amount='10' currency='USD' />{' '}
    //         </React.Fragment>
    //     }
    // />
    //     );
    // }
    return components;
});

export default Purchase;
