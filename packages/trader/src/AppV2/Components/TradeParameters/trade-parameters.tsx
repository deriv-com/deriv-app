import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { isTradeParamVisible, removeFocus } from 'AppV2/Utils/layout-utils';
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

type TTradeParametersProps = {
    is_minimized?: boolean;
};

const TradeParameters = observer(({ is_minimized }: TTradeParametersProps) => {
    const { contract_type, has_cancellation, symbol } = useTraderStore();
    const isVisible = (component_key: string) =>
        isTradeParamVisible({ component_key, contract_type, has_cancellation, symbol });

    React.useEffect(() => {
        const checkFocus = (e: React.FocusEvent) => {
            const should_remove_focus = e?.target?.hasAttribute('data-focus');
            if (should_remove_focus) removeFocus();
        };
        document.addEventListener('focusin', checkFocus as () => void);

        return () => {
            document.removeEventListener('focusin', checkFocus as () => void);
        };
    });

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
                    {isVisible('mult_info_display') && <MultipliersDealCancellationInfo />}
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
                {isVisible('mult_info_display') && !is_minimized && <MultipliersDealCancellationInfo />}
            </div>
        </div>
    );
});

export default TradeParameters;
