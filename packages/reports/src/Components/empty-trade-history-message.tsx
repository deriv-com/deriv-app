import React from 'react';
import { Icon, Text } from '@deriv/components';

type TEmptyTradeHistoryMessage = {
    component_icon: string;
    has_selected_date: boolean;
    localized_message: React.ReactNode;
    localized_period_message: React.ReactNode;
};

const EmptyTradeHistoryMessage = ({
    has_selected_date,
    component_icon,
    localized_message,
    localized_period_message,
}: TEmptyTradeHistoryMessage) => (
    <React.Fragment>
        <div className='empty-trade-history'>
            <Icon
                data_testid='dt_empty_trade_history_icon'
                icon={component_icon}
                className='empty-trade-history__icon'
                color='disabled'
                size={96}
            />
            <Text size='xs' align='center' color='disabled' className='empty-trade-history__text'>
                {!has_selected_date ? localized_message : localized_period_message}
            </Text>
        </div>
    </React.Fragment>
);

export default EmptyTradeHistoryMessage;
