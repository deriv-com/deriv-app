import React from 'react';
import { observer, useStore } from '@deriv-app/stores';
import { isAccumulatorContract, isDigitContract, isEnded } from '@deriv-app/shared';
import { Localize } from '@deriv-app/translations';
import { Text } from '@deriv-app/components';

const RecentTradeInfo = observer(() => {
    const { contract_trade } = useStore();
    const { granularity, filtered_contracts } = contract_trade;

    const latest_tick_contract = filtered_contracts[filtered_contracts.length - 1];

    if (
        !latest_tick_contract?.contract_info.tick_stream ||
        isAccumulatorContract(latest_tick_contract.contract_info.contract_type)
    )
        return null;

    const is_ended = isEnded(latest_tick_contract.contract_info);
    if (is_ended || granularity !== 0) return null;

    const { contract_type, tick_stream, tick_count } = latest_tick_contract.contract_info;
    const current_tick = isDigitContract(contract_type) ? tick_stream.length : Math.max(tick_stream.length - 1, 0);
    return (
        <Text weight='bold' className='recent-trade-info'>
            <Localize
                i18n_default_text='Tick {{current_tick}}/{{tick_count}}'
                values={{
                    current_tick,
                    tick_count,
                }}
            />
        </Text>
    );
});

export default RecentTradeInfo;
