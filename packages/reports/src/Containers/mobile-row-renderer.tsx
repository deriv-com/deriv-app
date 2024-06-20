import React from 'react';
import { ProgressBar, ProgressSliderMobile, DataList, ContractCard, PositionsDrawerCard } from '@deriv/components';
import {
    isAccumulatorContract,
    isMultiplierContract,
    isVanillaContract,
    isTurbosContract,
    getContractDurationType,
    getTimePercentage,
    getCurrentTick,
    getDurationPeriod,
    getDurationUnitText,
    getCardLabels,
    toMoment,
} from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { TColIndex } from 'Types';
import moment from 'moment';

type TRangeFloatZeroToOne = React.ComponentProps<typeof ProgressBar>['value'];
type TPortfolioStore = ReturnType<typeof useStore>['portfolio'];
type TDataList = React.ComponentProps<typeof DataList>;
type TDataListCell = React.ComponentProps<typeof DataList.Cell>;
type TUiStore = Pick<
    ReturnType<typeof useStore>['ui'],
    | 'addToast'
    | 'current_focus'
    | 'removeToast'
    | 'setCurrentFocus'
    | 'should_show_cancellation_warning'
    | 'toggleCancellationWarning'
>;

export type TMobileRowRenderer = TUiStore & {
    row?: TDataList['data_source'][0];
    is_footer?: boolean;
    columns_map: Record<TColIndex, TDataListCell['column']>;
    getContractById: ReturnType<typeof useStore>['contract_trade']['getContractById'];
    server_time: moment.Moment;
    onClickCancel: (contract_id?: number) => void;
    onClickRemove: TPortfolioStore['removePositionById'];
    onClickSell: (contract_id?: number) => void;
    measure?: () => void;
};

export const MobileRowRenderer = ({
    row = {},
    is_footer,
    columns_map = {},
    server_time = toMoment(),
    onClickCancel,
    onClickSell,
    measure,
    ...props
}: TMobileRowRenderer) => {
    React.useEffect(() => {
        if (!is_footer) {
            measure?.();
        }
    }, [row.contract_info?.underlying, measure, is_footer]);

    if (is_footer) {
        return (
            <div className='open-positions__data-list-footer--content'>
                <div>
                    <DataList.Cell row={row} column={columns_map.purchase} />
                    <DataList.Cell row={row} column={columns_map.payout} />
                </div>
                <div>
                    <DataList.Cell className='data-list__row-cell--amount' row={row} column={columns_map.indicative} />
                    <DataList.Cell className='data-list__row-cell--amount' row={row} column={columns_map.profit} />
                </div>
            </div>
        );
    }

    const { contract_info, contract_update, type, is_sell_requested } = row as TPortfolioStore['active_positions'][0];
    const { currency, date_expiry, date_start, tick_count, purchase_time } = contract_info;
    const current_tick = tick_count ? getCurrentTick(contract_info) : null;
    const turbos_duration_unit = tick_count ? 'ticks' : getDurationUnitText(getDurationPeriod(contract_info), true);
    const duration_type = getContractDurationType(
        (isTurbosContract(contract_info.contract_type) ? turbos_duration_unit : contract_info.longcode) || ''
    );
    const progress_value = (getTimePercentage(server_time, date_start ?? 0, date_expiry ?? 0) /
        100) as TRangeFloatZeroToOne;

    if (isMultiplierContract(type) || isAccumulatorContract(type)) {
        return (
            <PositionsDrawerCard
                contract_info={contract_info}
                contract_update={contract_update}
                currency={currency ?? ''}
                is_link_disabled
                onClickCancel={onClickCancel}
                onClickSell={onClickSell}
                server_time={server_time}
                {...props}
            />
        );
    }

    return (
        <>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.type} />
                {isVanillaContract(type) || (isTurbosContract(type) && !tick_count) ? (
                    <ProgressSliderMobile
                        current_tick={current_tick}
                        className='data-list__row--timer'
                        expiry_time={date_expiry}
                        getCardLabels={getCardLabels}
                        is_loading={false}
                        server_time={server_time}
                        start_time={purchase_time}
                        ticks_count={tick_count}
                    />
                ) : (
                    <ProgressBar label={duration_type ?? ''} value={progress_value} />
                )}
            </div>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.reference} />
                <DataList.Cell className='data-list__row-cell--amount' row={row} column={columns_map.currency} />
            </div>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.purchase} />
                <DataList.Cell className='data-list__row-cell--amount' row={row} column={columns_map.indicative} />
            </div>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.payout} />
                <DataList.Cell className='data-list__row-cell--amount' row={row} column={columns_map.profit} />
            </div>
            <div className='data-list__row-divider' />
            <div className='data-list__row'>
                <ContractCard.Sell
                    contract_info={contract_info}
                    is_sell_requested={is_sell_requested}
                    getCardLabels={getCardLabels}
                    onClickSell={onClickSell}
                />
            </div>
        </>
    );
};
