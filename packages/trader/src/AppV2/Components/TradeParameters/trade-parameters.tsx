import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { isTradeParamVisible } from 'AppV2/Utils/layout-utils';
import AllowEquals from './AllowEquals';
import Duration from './Duration';
import Stake from './Stake';
import Barrier from './Barrier';
import GrowthRate from './GrowthRate';
import TakeProfit from './TakeProfit';
import AccumulatorsInformation from './AccumulatorsInformation';
import Multiplier from './Multiplier';
import RiskManagement from './RiskManagement';
import MultipliersDealCancellationInfo from './MultipliersDealCancellationInfo';
import TradeTypeTabs from './TradeTypeTabs';
import Strike from './Strike';
import PayoutPerPoint from './PayoutPerPoint';
import LastDigitPrediction from './LastDigitPrediction';
import MultipliersExpirationInfo from './MultipliersExpirationInfo';
import BarrierInfo from './BarrierInfo';
import PayoutPerPointInfo from './PayoutPerPointInfo';
import PayoutInfo from './PayoutInfo';

export type TTradeParametersProps = {
    is_minimized?: boolean;
    is_disabled?: boolean;
};

const TradeParameters = observer(({ is_minimized, is_disabled }: TTradeParametersProps) => {
    const { contract_type, has_cancellation, symbol } = useTraderStore();
    const isVisible = (component_key: string) =>
        isTradeParamVisible({ component_key, contract_type, has_cancellation, symbol });

    return (
        <div
            className={clsx(
                'trade-params__options__wrapper',
                is_minimized && 'trade-params__options__wrapper--minimized'
            )}
        >
            {is_minimized && (
                <React.Fragment>
                    {isVisible('expiration') && <MultipliersExpirationInfo is_disabled={is_disabled} />}
                    {isVisible('mult_info_display') && <MultipliersDealCancellationInfo is_disabled={is_disabled} />}
                    {isVisible('payout_per_point_info') && <PayoutPerPointInfo is_disabled={is_disabled} />}
                    {isVisible('allow_equals') && <AllowEquals is_disabled={is_disabled} />}
                    {isVisible('payout') && <PayoutInfo is_disabled={is_disabled} />}
                </React.Fragment>
            )}
            <div
                className={clsx(
                    'trade-params__options__wrapper',
                    is_minimized && 'trade-params__options__wrapper--horizontal'
                )}
            >
                {isVisible('trade_type_tabs') && (
                    <TradeTypeTabs is_minimized={is_minimized} is_disabled={is_disabled} />
                )}
                {isVisible('last_digit') && (
                    <LastDigitPrediction is_minimized={is_minimized} is_disabled={is_disabled} />
                )}
                {isVisible('duration') && <Duration is_minimized={is_minimized} is_disabled={is_disabled} />}
                {isVisible('strike') && <Strike is_minimized={is_minimized} is_disabled={is_disabled} />}
                {isVisible('barrier') && <Barrier is_minimized={is_minimized} is_disabled={is_disabled} />}
                {isVisible('growth_rate') && <GrowthRate is_minimized={is_minimized} is_disabled={is_disabled} />}
                {isVisible('multiplier') && <Multiplier is_minimized={is_minimized} is_disabled={is_disabled} />}
                {isVisible('stake') && <Stake is_minimized={is_minimized} is_disabled={is_disabled} />}
                {isVisible('payout_per_point') && (
                    <PayoutPerPoint is_minimized={is_minimized} is_disabled={is_disabled} />
                )}
                {isVisible('allow_equals') && !is_minimized && <AllowEquals is_disabled={is_disabled} />}
                {isVisible('take_profit') && <TakeProfit is_minimized={is_minimized} is_disabled={is_disabled} />}
                {isVisible('risk_management') && (
                    <RiskManagement is_minimized={is_minimized} is_disabled={is_disabled} />
                )}
                {isVisible('expiration') && !is_minimized && <MultipliersExpirationInfo is_disabled={is_disabled} />}
                {isVisible('accu_info_display') && !is_minimized && (
                    <AccumulatorsInformation is_disabled={is_disabled} />
                )}
                {isVisible('barrier_info') && !is_minimized && <BarrierInfo is_disabled={is_disabled} />}
                {isVisible('payout_per_point_info') && !is_minimized && (
                    <PayoutPerPointInfo is_disabled={is_disabled} />
                )}
                {isVisible('payout') && !is_minimized && <PayoutInfo is_disabled={is_disabled} />}
                {isVisible('mult_info_display') && !is_minimized && (
                    <MultipliersDealCancellationInfo is_disabled={is_disabled} />
                )}
            </div>
        </div>
    );
});

export default TradeParameters;
