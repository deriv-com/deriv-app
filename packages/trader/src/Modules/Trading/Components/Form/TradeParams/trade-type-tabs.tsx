import classNames from 'classnames';
import React from 'react';
import { ButtonToggle } from '@deriv/components';
import { isTurbosContract, isVanillaContract } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';

type TTradeTypeTabs = {
    className?: string;
};

const TradeTypeTabs = observer(({ className }: TTradeTypeTabs) => {
    const {
        modules: { trade },
    } = useStore();

    const { onChange, contract_type, vanilla_trade_type } = trade;

    let tab_list;
    if (isTurbosContract(contract_type)) {
        tab_list = [
            { text: localize('Long'), value: 'turboslong' },
            { text: localize('Short'), value: 'turbosshort' },
        ];
    } else if (isVanillaContract(contract_type)) {
        tab_list = [
            { text: localize('Call'), value: 'VANILLALONGCALL' },
            { text: localize('Put'), value: 'VANILLALONGPUT' },
        ];
    } else {
        return null;
    }

    return (
        <div className={classNames('trade-container__trade', 'trade-container__trade-type-tabs', className)}>
            <ButtonToggle
                id='dt_advanced_duration_toggle'
                buttons_arr={tab_list}
                name={isTurbosContract(contract_type) ? 'contract_type' : 'vanilla_trade_type'}
                className='trade-container__trade-type-tabs--button'
                is_animated
                onChange={onChange}
                value={tab_list.find(tab => tab.value === contract_type)?.value || vanilla_trade_type}
            />
        </div>
    );
});

export default TradeTypeTabs;
