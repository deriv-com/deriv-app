import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { isTradeParamVisible } from 'AppV2/Utils/layout-utils';
import { useTraderStore } from 'Stores/useTraderStores';

import AccumulatorsInformation from './AccumulatorsInformation';
import AllowEquals from './AllowEquals';
import Barrier from './Barrier';
import BarrierInfo from './BarrierInfo';
import Duration from './Duration';
import GrowthRate from './GrowthRate';
import LastDigitPrediction from './LastDigitPrediction';
import Multiplier from './Multiplier';
import MultipliersDealCancellationInfo from './MultipliersDealCancellationInfo';
import MultipliersExpirationInfo from './MultipliersExpirationInfo';
import PayoutInfo from './PayoutInfo';
import PayoutPerPoint from './PayoutPerPoint';
import PayoutPerPointInfo from './PayoutPerPointInfo';
import RiskManagement from './RiskManagement';
import Stake from './Stake';
import Strike from './Strike';
import TakeProfit from './TakeProfit';
import TradeTypeTabs from './TradeTypeTabs';

export type TTradeParametersProps = { is_minimized?: boolean };

const TradeParameters = observer(({ is_minimized }: TTradeParametersProps) => {
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
                    {isVisible('expiration') && <MultipliersExpirationInfo />}
                    {isVisible('payout_per_point_info') && <PayoutPerPointInfo />}
                    {isVisible('allow_equals') && <AllowEquals />}
                    {isVisible('payout') && <PayoutInfo />}
                </React.Fragment>
            )}
            <div
                className={clsx(
                    'trade-params__options__wrapper',
                    is_minimized && 'trade-params__options__wrapper--horizontal'
                )}
            >
                {isVisible('trade_type_tabs') && <TradeTypeTabs is_minimized={is_minimized} />}
                {isVisible('last_digit') && <LastDigitPrediction is_minimized={is_minimized} />}
                {isVisible('duration') && <Duration is_minimized={is_minimized} />}
                {isVisible('strike') && <Strike is_minimized={is_minimized} />}
                {isVisible('barrier') && <Barrier is_minimized={is_minimized} />}
                {isVisible('growth_rate') && <GrowthRate is_minimized={is_minimized} />}
                {isVisible('multiplier') && <Multiplier is_minimized={is_minimized} />}
                {isVisible('stake') && <Stake is_minimized={is_minimized} />}
                {isVisible('payout_per_point') && <PayoutPerPoint is_minimized={is_minimized} />}
                {isVisible('allow_equals') && !is_minimized && <AllowEquals />}
                {isVisible('take_profit') && <TakeProfit is_minimized={is_minimized} />}
                {isVisible('risk_management') && <RiskManagement is_minimized={is_minimized} />}
                {isVisible('expiration') && !is_minimized && <MultipliersExpirationInfo />}
                {isVisible('accu_info_display') && !is_minimized && <AccumulatorsInformation />}
                {isVisible('barrier_info') && !is_minimized && <BarrierInfo />}
                {isVisible('payout_per_point_info') && !is_minimized && <PayoutPerPointInfo />}
                {isVisible('payout') && !is_minimized && <PayoutInfo />}
            </div>
            {isVisible('mult_info_display') && <MultipliersDealCancellationInfo is_minimized={is_minimized} />}
        </div>
    );
});

export default TradeParameters;
