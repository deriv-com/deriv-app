import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { Button } from '@deriv-com/quill-ui';
import { useDevice } from '@deriv-com/ui';
import {
    getContractTypeDisplay,
    getIndicativePrice,
    hasContractEntered,
    isAccumulatorContract,
    isEmptyObject,
    isOpen,
    isValidToSell,
} from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { TTradeStore } from 'Types';
import PurchaseButtonContent from './purchase-button-content';

const PurchaseButton = observer(() => {
    const {
        portfolio: { all_positions, onClickSell },
        ui: { purchase_states: purchased_states_arr, setPurchaseState },
    } = useStore();
    const {
        contract_type,
        currency,
        has_open_accu_contract,
        is_accumulator,
        is_multiplier,
        is_purchase_enabled,
        is_trade_enabled,
        is_turbos,
        is_vanilla_fx,
        is_vanilla,
        onPurchase,
        proposal_info,
        symbol,
        trade_types,
        validation_errors,
    } = useTraderStore();
    const { isMobile } = useDevice();
    //TODO: add error handling when design will be ready
    const is_high_low = /^high_low$/.test(contract_type.toLowerCase());
    const is_proposal_empty = isEmptyObject(proposal_info);
    const is_disabled = !is_trade_enabled || !is_purchase_enabled || is_proposal_empty;
    const purchase_button_content_props = {
        currency,
        has_open_accu_contract,
        is_accumulator,
        is_multiplier,
        is_turbos,
        is_vanilla_fx,
        is_vanilla,
    };
    const trade_types_array = Object.keys(trade_types);

    const isLoading = (info: TTradeStore['proposal_info'][string]) => {
        const has_validation_error = Object.values(validation_errors).some(e => e.length);
        return !has_validation_error && !info?.has_error && !info.id;
    };

    const active_accu_contract = is_accumulator
        ? all_positions.find(
              ({ contract_info, type }) =>
                  isAccumulatorContract(type) && contract_info.underlying === symbol && !contract_info.is_sold
          )
        : undefined;
    const is_valid_to_sell = active_accu_contract?.contract_info
        ? hasContractEntered(active_accu_contract.contract_info) &&
          isOpen(active_accu_contract.contract_info) &&
          isValidToSell(active_accu_contract.contract_info)
        : false;
    const current_stake =
        (is_valid_to_sell && active_accu_contract && getIndicativePrice(active_accu_contract.contract_info)) || null;

    if (is_accumulator && has_open_accu_contract) {
        const info = proposal_info?.[trade_types_array[0]] || {};
        return (
            <div className='purchase-button__wrapper'>
                <Button
                    color='black'
                    variant='secondary'
                    size='lg'
                    label={<Localize i18n_default_text='Sell' />}
                    fullWidth
                    className='purchase-button purchase-button--single'
                    disabled={!is_valid_to_sell || active_accu_contract?.is_sell_requested}
                    onClick={() => onClickSell(active_accu_contract?.contract_info.contract_id)}
                >
                    <PurchaseButtonContent
                        {...purchase_button_content_props}
                        info={info}
                        current_stake={current_stake}
                    />
                </Button>
            </div>
        );
    }

    if (trade_types_array.length === 1) {
        const info = proposal_info?.[trade_types_array[0]] || {};
        const is_loading = isLoading(info) || !is_purchase_enabled;

        return (
            <div className='purchase-button__wrapper'>
                <Button
                    color='purchase'
                    size='lg'
                    label={getContractTypeDisplay(trade_types_array[0], {
                        isHighLow: is_high_low,
                        showButtonName: true,
                    })}
                    fullWidth
                    className='purchase-button purchase-button--single'
                    isLoading={is_loading}
                    disabled={(is_disabled || !info.id) && !is_loading}
                    onClick={() => onPurchase(info.id, info.stake, trade_types_array[0], isMobile)}
                >
                    {!is_loading && <PurchaseButtonContent {...purchase_button_content_props} info={info} />}
                </Button>
            </div>
        );
    }

    return (
        <div className='purchase-button__wrapper'>
            {trade_types_array.map((trade_type, index) => {
                const info = proposal_info?.[trade_type] || {};
                const is_loading = isLoading(info);
                const is_another_button_loading =
                    is_loading &&
                    purchased_states_arr.includes(true) &&
                    !purchased_states_arr[index] &&
                    !is_purchase_enabled;

                return (
                    <Button
                        key={trade_type}
                        color={index ? 'purchase' : 'sell'}
                        size='lg'
                        label={getContractTypeDisplay(trade_type, { isHighLow: is_high_low, showButtonName: true })}
                        fullWidth
                        className={clsx(
                            'purchase-button',
                            is_loading && !is_another_button_loading && 'purchase-button--loading'
                        )}
                        isLoading={is_loading && !is_another_button_loading}
                        disabled={((is_disabled || !info.id) && !is_loading) || is_another_button_loading}
                        onClick={() => {
                            setPurchaseState(index);
                            onPurchase(info.id, info.stake, trade_type, isMobile);
                        }}
                    >
                        {(!is_loading || is_another_button_loading) && (
                            <PurchaseButtonContent
                                {...purchase_button_content_props}
                                info={info}
                                is_reverse={!!index}
                            />
                        )}
                    </Button>
                );
            })}
        </div>
    );
});

export default PurchaseButton;
