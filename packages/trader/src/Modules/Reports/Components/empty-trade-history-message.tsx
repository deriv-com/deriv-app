import React from 'react';
import { Icon, Text } from '@deriv/components';

type EmptyTradeHistoryMessageProps = {
    component_icon: string;
    has_selected_date: boolean;
    localized_message: string;
    localized_period_message: string;
};

const EmptyTradeHistoryMessage = ({
    has_selected_date,
    component_icon,
    localized_message,
    localized_period_message,
}: EmptyTradeHistoryMessageProps) => (
    <React.Fragment>
        <div className='empty-trade-history'>
            <Icon icon={component_icon} className='empty-trade-history__icon' color='disabled' size={96} />
            <Text size='xs' align='center' color='disabled' className='empty-trade-history__text'>
                {!has_selected_date ? localized_message : localized_period_message}
            </Text>
        </div>
    </React.Fragment>
);

export default EmptyTradeHistoryMessage;
