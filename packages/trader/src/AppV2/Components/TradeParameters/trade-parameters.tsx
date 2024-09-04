import React from 'react';
import { getTradeParams } from 'AppV2/Utils/trade-params-utils';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
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

type TTradeParametersProps = {
    is_minimized?: boolean;
};

const TradeParameters = observer(({ is_minimized }: TTradeParametersProps) => {
    const { contract_type, has_cancellation, symbol } = useTraderStore();
    const isVisible = (component_key: string) => {
        const params = getTradeParams(symbol, has_cancellation)?.[contract_type] ?? {};
        return component_key in params;
    };

    return (
        <React.Fragment>
            <div
                className={clsx(
                    'trade-params__options__wrapper',
                    is_minimized && 'trade-params__options__wrapper--minimized'
                )}
            >
                {isVisible('trade_type_tabs') && <TradeTypeTabs is_minimized={is_minimized} />}
                {isVisible('last_digit') && <LastDigitPrediction is_minimized={is_minimized} />}
                {isVisible('duration') && <Duration is_minimized={is_minimized} />}
                {isVisible('strike') && <Strike is_minimized={is_minimized} />}
                {isVisible('payout_per_point') && <PayoutPerPoint is_minimized={is_minimized} />}
                {isVisible('barrier') && <Barrier is_minimized={is_minimized} />}
                {isVisible('growth_rate') && <GrowthRate is_minimized={is_minimized} />}
                {isVisible('multiplier') && <Multiplier is_minimized={is_minimized} />}
                {isVisible('stake') && <Stake is_minimized={is_minimized} />}
                {isVisible('allow_equals') && <AllowEquals is_minimized={is_minimized} />}
                {isVisible('take_profit') && <TakeProfit is_minimized={is_minimized} />}
                {isVisible('risk_management') && <RiskManagement is_minimized={is_minimized} />}
                {isVisible('expiration') && !is_minimized && <MultipliersExpirationInfo />}
                {isVisible('accu_info_display') && <AccumulatorsInformation is_minimized={is_minimized} />}
                {isVisible('barrier_info') && !is_minimized && <BarrierInfo />}
                {isVisible('payout_per_point_info') && !is_minimized && <PayoutPerPointInfo />}
                {isVisible('mult_info_display') && !is_minimized && <MultipliersDealCancellationInfo />}
            </div>
            {is_minimized && isVisible('expiration') && (
                <div className='trade-params__options-info-standalone'>
                    <MultipliersExpirationInfo />
                </div>
            )}
            {is_minimized && isVisible('payout_per_point_info') && (
                <div className='trade-params__options-info-standalone'>
                    <PayoutPerPointInfo />
                </div>
            )}
            {is_minimized && isVisible('mult_info_display') && (
                <MultipliersDealCancellationInfo classname='multipliers-info--standalone' />
            )}
        </React.Fragment>
    );
});

export default TradeParameters;
