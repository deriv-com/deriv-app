import React from 'react';
import EntryExitDetails from 'AppV2/Components/EntryExitDetails';
import TakeProfitHistory from 'AppV2/Components/TakeProfitHistory';
import PayoutInfo from 'AppV2/Components/PayoutInfo';
import ChartPlaceholder from '../Chart';
import CardWrapper from 'AppV2/Components/CardWrapper';
import { observer, useStore } from '@deriv/stores';
import useContractDetails from 'AppV2/Hooks/useContractDetails';
import OrderDetails from 'AppV2/Components/OrderDetails';
import { getContractDetailsConfig } from 'AppV2/Utils/contract-details-config';
import TakeProfit from 'AppV2/Components/TakeProfit/take-profit';
import StopLoss from 'AppV2/Components/StopLoss/stop-loss';
import DealCancellation from 'AppV2/Components/DealCancellation/deal-cancellation';
import {
    isForwardStarting,
    isMultiplierContract,
    isOpen,
    isValidToCancel,
    WS,
    TContractStore,
    isValidToSell,
    hasContractEntered,
    isAccumulatorContract,
} from '@deriv/shared';
import classNames from 'classnames';
import ContractDetailsFooter from 'AppV2/Components/ContractDetailsFooter';
import { ContractCard } from 'AppV2/Components/ContractCard';

const ContractDetails = observer(() => {
    const { contract_info, is_loading } = useContractDetails();
    const { contract_id, currency, contract_type, limit_order } = contract_info;
    const [update_history, setUpdateHistory] = React.useState<TContractUpdateHistory>([]);
    const { common } = useStore();
    const { server_time } = common;
    const { is_take_profit_visible, is_stop_loss_visible } = getContractDetailsConfig(contract_type ?? '');
    const is_valid_to_sell = isValidToSell(contract_info);
    type TContractUpdateHistory = TContractStore['contract_update_history'];
    type TResponse = {
        contract_update_history: TContractUpdateHistory;
    };

    const getSortedUpdateHistory = (history: TContractUpdateHistory) =>
        history.sort((a, b) => Number(b?.order_date) - Number(a?.order_date));
    const requestUpdatedHistory = React.useCallback((id?: number) => {
        if (!id) return;
        WS.contractUpdateHistory(id)
            .then((response: TResponse) => {
                setUpdateHistory(getSortedUpdateHistory(response.contract_update_history));
            })
            .catch(() => null);
    }, []);

    React.useEffect(() => {
        requestUpdatedHistory(contract_id);
    }, [contract_id, limit_order, requestUpdatedHistory]);

    if (is_loading) return <></>;

    const is_multiplier = isMultiplierContract(contract_info.contract_type);

    const is_valid_to_cancel = isValidToCancel(contract_info);
    const should_show_sell =
        (hasContractEntered(contract_info) ||
            isForwardStarting(contract_info?.shortcode ?? '', contract_info.purchase_time)) &&
        isOpen(contract_info);
    const { is_tp_history_visible, is_deal_cancellation_visible } = getContractDetailsConfig(
        contract_info.contract_type ?? ''
    );
    const show_cancel_button = is_multiplier && is_valid_to_cancel;
    let showTpSl =
        isOpen(contract_info) &&
        (is_take_profit_visible || is_stop_loss_visible) &&
        (is_valid_to_sell || is_deal_cancellation_visible);

    if (isAccumulatorContract(contract_info.contract_type)) {
        showTpSl = isOpen(contract_info) && Boolean(limit_order);
    }
    return (
        <div
            className={classNames('contract-details', {
                'contract-details--two-buttons': should_show_sell && show_cancel_button,
                'contract-details--one-button': should_show_sell && !show_cancel_button,
            })}
        >
            <div className='contract-card-wrapper'>
                <ContractCard contractInfo={contract_info} serverTime={server_time} />
            </div>
            <div className='placeholder'>
                <ChartPlaceholder />
            </div>
            <DealCancellation />
            {showTpSl && (
                <CardWrapper>
                    <TakeProfit />
                    <StopLoss />
                </CardWrapper>
            )}

            <OrderDetails contract_info={contract_info} />
            <PayoutInfo contract_info={contract_info} />
            <EntryExitDetails contract_info={contract_info} />
            {is_tp_history_visible && update_history.length > 0 && (
                <TakeProfitHistory history={update_history} currency={currency} />
            )}
            {should_show_sell && <ContractDetailsFooter contract_info={contract_info} />}
        </div>
    );
});

export default ContractDetails;
