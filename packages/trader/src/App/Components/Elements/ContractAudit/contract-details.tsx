import React from 'react';
import { Money, Icon, ThemedScrollbars } from '@deriv/components';
import { localize } from '@deriv/translations';
import {
    addComma,
    epochToMoment,
    getCancellationPrice,
    getCurrencyDisplayCode,
    getLocalizedBasis,
    hasTwoBarriers,
    isAccumulatorContract,
    isEndedBeforeCancellationExpired,
    isMobile,
    isMultiplierContract,
    isSmartTraderContract,
    isAsiansContract,
    isTurbosContract,
    isUserCancelled,
    isUserSold,
    isVanillaFxContract,
    toGMTFormat,
    TContractInfo,
} from '@deriv/shared';
import { Analytics } from '@deriv/analytics';
import { getBarrierLabel, getBarrierValue, isDigitType } from 'App/Components/Elements/PositionsDrawer/helpers';
import ContractAuditItem from './contract-audit-item';
import { isCancellationExpired } from 'Stores/Modules/Trading/Helpers/logic';

type TContractDetails = {
    contract_end_time?: number;
    contract_info: TContractInfo;
    duration: number | string;
    duration_unit: string;
    exit_spot?: string;
    is_vanilla?: boolean;
};

const ContractDetails = ({
    contract_end_time,
    contract_info,
    duration,
    duration_unit,
    exit_spot,
    is_vanilla,
}: TContractDetails) => {
    const {
        commission,
        contract_type,
        currency,
        date_start,
        display_number_of_contracts,
        entry_spot_display_value,
        entry_tick_time,
        exit_tick_time,
        high_barrier,
        low_barrier,
        profit,
        tick_count,
        tick_passed,
        transaction_ids: { buy, sell } = {},
        underlying,
    } = contract_info;

    const is_profit = Number(profit) >= 0;
    const cancellation_price = getCancellationPrice(contract_info);
    const show_barrier = !is_vanilla && !isAccumulatorContract(contract_type) && !isSmartTraderContract(contract_type);
    const show_duration = !isAccumulatorContract(contract_type) || !isNaN(Number(contract_end_time));
    const show_payout_per_point = isTurbosContract(contract_type) || is_vanilla;
    const ticks_label = Number(tick_count) < 2 ? localize('tick') : localize('ticks');
    const show_strike_barrier = is_vanilla || isAsiansContract(contract_type);
    const ticks_duration_text = isAccumulatorContract(contract_type)
        ? `${tick_passed}/${tick_count} ${localize('ticks')}`
        : `${tick_count} ${ticks_label}`;

    const vanilla_payout_text = isVanillaFxContract(contract_type, underlying)
        ? getLocalizedBasis().payout_per_pip
        : getLocalizedBasis().payout_per_point;

    const getLabel = () => {
        if (isUserSold(contract_info) && isEndedBeforeCancellationExpired(contract_info))
            return localize('Deal cancellation');
        if (isUserCancelled(contract_info)) return localize('Deal cancellation (executed)');
        if (isCancellationExpired(contract_info)) return localize('Deal cancellation (expired)');
        return localize('Deal cancellation (active)');
    };

    React.useEffect(() => {
        Analytics.trackEvent('ce_reports_form', {
            action: 'open_contract_details',
            form_name: 'default',
            form_source: 'deriv_trader',
        });
    }, []);

    return (
        <ThemedScrollbars is_bypassed={isMobile()}>
            <div className='contract-audit__tabs-content'>
                <ContractAuditItem
                    id='dt_id_label'
                    icon={<Icon icon='IcContractId' size={24} />}
                    label={localize('Reference ID')}
                    value={localize('{{buy_value}} (Buy)', { buy_value: buy })}
                    value2={sell ? localize('{{sell_value}} (Sell)', { sell_value: sell }) : undefined}
                />
                {isMultiplierContract(contract_type) ? (
                    <React.Fragment>
                        <ContractAuditItem
                            id='dt_commission_label'
                            icon={<Icon icon='IcContractCommission' size={24} />}
                            label={localize('Commission')}
                            value={<Money amount={commission ?? ''} currency={currency} show_currency />}
                        />
                        {!!cancellation_price && (
                            <ContractAuditItem
                                id='dt_cancellation_label'
                                icon={<Icon icon='IcContractSafeguard' size={24} />}
                                label={getLabel()}
                                value={<Money amount={cancellation_price} currency={currency} />}
                            />
                        )}
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {show_duration && (
                            <ContractAuditItem
                                id='dt_duration_label'
                                icon={<Icon icon='IcContractDuration' size={24} />}
                                label={localize('Duration')}
                                value={Number(tick_count) > 0 ? ticks_duration_text : `${duration} ${duration_unit}`}
                            />
                        )}
                        {show_strike_barrier && (
                            <ContractAuditItem
                                id='dt_bt_label'
                                icon={<Icon icon='IcContractStrike' size={24} />}
                                label={getBarrierLabel(contract_info)}
                                value={getBarrierValue(contract_info) || ' - '}
                            />
                        )}
                        {show_barrier && (
                            <ContractAuditItem
                                id='dt_bt_label'
                                icon={
                                    isDigitType(contract_type) ? (
                                        <Icon icon='IcContractTarget' size={24} />
                                    ) : (
                                        <Icon icon='IcContractBarrier' size={24} />
                                    )
                                }
                                label={getBarrierLabel(contract_info)}
                                value={getBarrierValue(contract_info) || ' - '}
                            />
                        )}
                        {hasTwoBarriers(contract_type) && (
                            <React.Fragment>
                                {[high_barrier, low_barrier].map((barrier, index) => (
                                    <ContractAuditItem
                                        id={`dt_bt_label_${index + 1}`}
                                        icon={<Icon icon='IcContractStrike' size={24} />}
                                        key={barrier}
                                        label={
                                            high_barrier === barrier
                                                ? localize('High barrier')
                                                : localize('Low barrier')
                                        }
                                        value={barrier}
                                    />
                                ))}
                            </React.Fragment>
                        )}
                        {show_payout_per_point && (
                            <ContractAuditItem
                                id='dt_bt_label'
                                icon={<Icon icon='IcContractPayout' size={24} />}
                                label={vanilla_payout_text}
                                value={
                                    display_number_of_contracts
                                        ? `${display_number_of_contracts} ${getCurrencyDisplayCode(currency)}`
                                        : ' - '
                                }
                            />
                        )}
                    </React.Fragment>
                )}
                <ContractAuditItem
                    id='dt_start_time_label'
                    icon={<Icon icon='IcContractStartTime' size={24} />}
                    label={localize('Start time')}
                    value={toGMTFormat(epochToMoment(Number(date_start))) || ' - '}
                />
                {!isDigitType(contract_type) && (
                    <ContractAuditItem
                        id='dt_entry_spot_label'
                        icon={<Icon icon='IcContractEntrySpot' size={24} />}
                        label={localize('Entry spot')}
                        value={entry_spot_display_value ? addComma(entry_spot_display_value) : ' - '}
                        value2={toGMTFormat(epochToMoment(Number(entry_tick_time))) || ' - '}
                    />
                )}
                {!isNaN(Number(exit_spot)) && (
                    <ContractAuditItem
                        id='dt_exit_spot_label'
                        icon={<Icon icon='IcContractExitSpot' size={24} />}
                        label={localize('Exit spot')}
                        value={exit_spot ? addComma(exit_spot) : ' - '}
                        value2={toGMTFormat(epochToMoment(Number(exit_tick_time))) || ' - '}
                    />
                )}
                {!isNaN(Number(contract_end_time)) && (
                    <ContractAuditItem
                        id='dt_exit_time_label'
                        icon={<Icon icon='IcContractExitTime' color={is_profit ? 'green' : 'red'} size={24} />}
                        label={localize('Exit time')}
                        value={toGMTFormat(epochToMoment(Number(contract_end_time))) || ' - '}
                    />
                )}
            </div>
        </ThemedScrollbars>
    );
};

export default ContractDetails;
