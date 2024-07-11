import React from 'react';
import { getTradeParams } from 'AppV2/Utils/trade-params-utils';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import AllowEquals from './AllowEquals';
import Duration from './Duration';
import Stake from './Stake';

type TTradeParamsProps = {
    is_minimized?: boolean;
};

const TradeParams = observer(({ is_minimized }: TTradeParamsProps) => {
    const {
        amount,
        basis,
        contract_start_type,
        contract_type,
        contract_types_list,
        currency,
        duration,
        duration_unit,
        expiry_type,
        is_equal,
        onChange,
        symbol,
    } = useTraderStore();
    const isVisible = (component_key: string) => {
        return getTradeParams(symbol)[contract_type].includes(component_key);
    };

    return (
        <div
            className={clsx(
                'trade-params__options__wrapper',
                is_minimized && 'trade-params__options__wrapper--minimized'
            )}
        >
            {/* {isVisible('trade_type_tabs') && <TradeTypeTabs />} */}
            {/* {isVisible('last_digit') && <LastDigit />} */}
            {isVisible('duration') && (
                <Duration duration={duration} duration_unit={duration_unit} is_minimized={is_minimized} />
            )}
            {/* {isVisible('strike') && <Strike />} */}
            {/* {isVisible('payout_per_point') && <PayoutPerPointSelector />} */}
            {/* {isVisible('barrier') && <Barrier />} */}
            {/* {isVisible('growth_rate') && <GrowthRate />} */}
            {isVisible('stake') && (
                <Stake
                    amount={amount}
                    basis={basis}
                    currency={currency}
                    onChange={onChange}
                    is_minimized={is_minimized}
                />
            )}
            {isVisible('allow_equals') && (
                <AllowEquals
                    contract_start_type={contract_start_type}
                    contract_types_list={contract_types_list}
                    duration_unit={duration_unit}
                    expiry_type={expiry_type}
                    is_minimized={is_minimized}
                    is_equal={is_equal}
                />
            )}
            {/* {isVisible('take_profit') && <TakeProfit />} */}
            {/* {isVisible('risk_management') && <RiskManagement />} */}
            {/* {isVisible('expiration') && <Expiration />} */}
            {/* {isVisible('accu_info_display') && <AccumulatorsInfoDisplay />} */}
            {/* {isVisible('mult_info_display') && <MultipliersInfoDisplay />} */}
        </div>
    );
});

export default TradeParams;
