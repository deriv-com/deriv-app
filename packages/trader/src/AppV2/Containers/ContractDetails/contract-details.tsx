import React from 'react';
import { CaptionText, Text } from '@deriv-com/quill-ui';
import EntryExitDetails from 'AppV2/Components/EntryExitDetails';
import TakeProfitHistory from 'AppV2/Components/TakeProfitHistory';
import PayoutInfo from 'AppV2/Components/PayoutInfo';
import ChartPlaceholder from '../Chart';
import CardWrapper from 'AppV2/Components/CardWrapper';
import { observer } from '@deriv/stores';
import useContractDetails from 'AppV2/Hooks/useContractDetails';
import OrderDetails from 'AppV2/Components/OrderDetails';
import { getContractDetailsConfig } from 'AppV2/Utils/contract-details-config';
import TakeProfit from 'AppV2/Components/TakeProfit/take-profit';
import StopLoss from 'AppV2/Components/StopLoss/stop-loss';
import DealCancellation from 'AppV2/Components/DealCancellation/deal-cancellation';
import {
    hasContractStarted,
    isForwardStarting,
    isMultiplierContract,
    isOpen,
    isValidToCancel,
    WS,
    TContractStore,
} from '@deriv/shared';
import classNames from 'classnames';
import ContractDetailsFooter from 'AppV2/Components/ContractDetailsFooter';
import { ContractCard } from 'AppV2/Components/ContractCard';

const ContractDetails = observer(() => {
    const { contract_info, is_loading } = useContractDetails();
    const { contract_id, currency } = contract_info;
    const [update_history, setUpdateHistory] = React.useState<TContractUpdateHistory>([]);

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
    }, [contract_id, requestUpdatedHistory]);

    if (is_loading) return <></>;

    const is_multiplier = isMultiplierContract(contract_info.contract_type);
    const is_valid_to_cancel = isValidToCancel(contract_info);
    const should_show_sell =
        (hasContractStarted(contract_info) ||
            isForwardStarting(contract_info?.shortcode ?? '', contract_info.purchase_time)) &&
        isOpen(contract_info);
    const { is_tp_history_visible } = getContractDetailsConfig(contract_info.contract_type ?? '');
    const show_cancel_button = is_multiplier && is_valid_to_cancel;

    return (
        <div
            className={classNames('contract-details', {
                'contract-details--two-buttons': should_show_sell && show_cancel_button,
                'contract-details--one-button': should_show_sell && !show_cancel_button,
            })}
        >
            <ContractCard contractInfo={contract_info} />
            {/* END OF CONTRACT CARD */}
            <div className='placeholder'>
                <ChartPlaceholder />
            </div>
            <DealCancellation />
            {isOpen(contract_info) && (
                <CardWrapper>
                    <TakeProfit />
                    <StopLoss />
                </CardWrapper>
            )}
            <CardWrapper title='Order Details'>
                <OrderDetails contract_info={contract_info} />
            </CardWrapper>
            <PayoutInfo contract_info={contract_info} />
            <EntryExitDetails contract_info={contract_info} />
            {is_tp_history_visible && <TakeProfitHistory history={update_history} currency={currency} />}
            {should_show_sell && <ContractDetailsFooter contract_info={contract_info} />}
        </div>
    );
});

export default ContractDetails;
