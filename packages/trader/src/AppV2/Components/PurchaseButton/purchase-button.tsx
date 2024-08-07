import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { Button } from '@deriv-com/quill-ui';
import { useDevice } from '@deriv-com/ui';
import {
    getCardLabelsV2,
    getContractTypeDisplay,
    getIndicativePrice,
    hasContractEntered,
    isAccumulatorContract,
    isEmptyObject,
    isOpen,
    isValidToSell,
} from '@deriv/shared';
import PurchaseButtonContent from './purchase-button-content';
import { getTradeTypeTabsList } from 'AppV2/Utils/trade-params-utils';

const PurchaseButton = observer(() => {
    const [loading_button_index, setLoadingButtonIndex] = React.useState<number | null>(null);
    const { isMobile } = useDevice();

    const {
        portfolio: { all_positions, onClickSell },
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
        trade_type_tab,
        trade_types,
    } = useTraderStore();

    /*TODO: add error handling when design will be ready. validation_errors can be taken from useTraderStore
    const hasError = (info: TTradeStore['proposal_info'][string]) => {
        const has_validation_error = Object.values(validation_errors).some(e => e.length);
        return has_validation_error || info?.has_error
    };*/
    const is_high_low = /^high_low$/.test(contract_type.toLowerCase());
    const is_proposal_empty = isEmptyObject(proposal_info);
    const purchase_button_content_props = {
        currency,
        has_open_accu_contract,
        is_accumulator,
        is_multiplier,
        is_turbos,
        is_vanilla_fx,
        is_vanilla,
    };
    const trade_types_array = Object.keys(trade_types).filter(
        type => !getTradeTypeTabsList(contract_type).length || type === trade_type_tab
    );
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
    const cardLabels = getCardLabelsV2();

    const getButtonType = (index: number, trade_type: string) => {
        const tab_index = getTradeTypeTabsList(contract_type).findIndex(tab => tab.contract_type === trade_type);
        const button_index = tab_index < 0 ? index : tab_index;
        return button_index ? 'sell' : 'purchase';
    };

    React.useEffect(() => {
        if (is_purchase_enabled) setLoadingButtonIndex(null);
    }, [is_purchase_enabled]);

    if (is_accumulator && has_open_accu_contract) {
        const is_accu_sell_disabled = !is_valid_to_sell || active_accu_contract?.is_sell_requested;
        return (
            <div className='purchase-button__wrapper'>
                <Button
                    color='black'
                    size='lg'
                    label={
                        is_accu_sell_disabled
                            ? `${cardLabels.CLOSE}`
                            : `${cardLabels.CLOSE} ${current_stake} ${currency}`
                    }
                    fullWidth
                    className='purchase-button purchase-button--single'
                    disabled={is_accu_sell_disabled}
                    onClick={() => onClickSell(active_accu_contract?.contract_info.contract_id)}
                />
                {is_accu_sell_disabled && <div className='purchase-button purchase-button--disabled-background' />}
            </div>
        );
    }

    return (
        <div className='purchase-button__wrapper'>
            {trade_types_array.map((trade_type, index) => {
                const info = proposal_info?.[trade_type] || {};
                const is_single_button = trade_types_array.length === 1;
                const is_loading = loading_button_index === index;
                const is_disabled = !is_trade_enabled || is_proposal_empty || !info.id || !is_purchase_enabled;

                return (
                    <React.Fragment key={trade_type}>
                        <Button
                            color={getButtonType(index, trade_type)}
                            size='lg'
                            label={getContractTypeDisplay(trade_type, { isHighLow: is_high_low, showButtonName: true })}
                            fullWidth
                            className={clsx(
                                'purchase-button',
                                is_loading && 'purchase-button--loading',
                                is_single_button && 'purchase-button--single'
                            )}
                            isLoading={is_loading}
                            disabled={is_disabled && !is_loading}
                            onClick={() => {
                                setLoadingButtonIndex(index);
                                onPurchase(info.id, info.stake, trade_type, isMobile);
                            }}
                        >
                            {!is_loading && !is_accumulator && (
                                <PurchaseButtonContent
                                    {...purchase_button_content_props}
                                    info={info}
                                    is_reverse={!!index}
                                />
                            )}
                        </Button>
                        {is_disabled && !is_loading && (
                            <div className='purchase-button purchase-button--disabled-background' />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
});

export default PurchaseButton;
