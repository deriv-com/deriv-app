import classNames from 'classnames';
import React from 'react';
import { ButtonToggle } from '@deriv/components';
import { isTurbosContract } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';

type TTradeTypeTabs = {
    className?: string;
};
const TradeTypeTabs = observer(({ className }: TTradeTypeTabs) => {
    const {
        modules: { trade },
    } = useStore();
    const { onChange, contract_type } = trade;
    const tab_list = [
        { text: localize('Long'), value: 'turboslong' },
        { text: localize('Short'), value: 'turbosshort' },
    ];

    if (!isTurbosContract(contract_type)) return null;

    return (
        <div className={classNames('trade-container__trade', 'trade-container__trade-type-tabs', className)}>
            <ButtonToggle
                id='dt_advanced_duration_toggle'
                buttons_arr={tab_list}
                name='contract_type'
                className='trade-container__trade-type-tabs--button'
                is_animated
                onChange={onChange}
                value={tab_list.find(tab => tab.value === contract_type)?.value || ''}
            />
        </div>
    );
});

export default TradeTypeTabs;
