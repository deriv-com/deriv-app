import React from 'react';
import { Text, SectionMessage } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';

type TRiskManagementContentProps = {
    should_show_deal_cancellation?: boolean;
};

const RiskManagementContent = ({ should_show_deal_cancellation }: TRiskManagementContentProps) => (
    <React.Fragment>
        <Text bold color='quill-typography__color--prominent'>
            <Localize i18n_default_text='TakeProfit' />
        </Text>
        <Text className='risk-management__description__definition'>
            <Localize i18n_default_text='When your profit reaches or exceeds this amount, your trade will be closed automatically.' />
        </Text>
        <Text bold color='quill-typography__color--prominent'>
            <Localize i18n_default_text='Stop loss' />
        </Text>
        <Text className='risk-management__description__definition'>
            <Localize i18n_default_text='When your loss reaches or exceeds this amount, your trade will be closed automatically.' />
        </Text>
        {should_show_deal_cancellation && (
            <React.Fragment>
                <Text bold color='quill-typography__color--prominent'>
                    <Localize i18n_default_text='Deal cancellation' />
                </Text>
                <Text className='risk-management__description__definition'>
                    <Localize i18n_default_text='When this is active, you can cancel your trade within the chosen time frame. Your stake will be returned without loss.' />
                </Text>
                <SectionMessage
                    message={
                        <Localize i18n_default_text='Take profit and/or stop loss are not available while deal cancellation is active.' />
                    }
                    size='sm'
                    status='info'
                />
            </React.Fragment>
        )}
    </React.Fragment>
);

export default RiskManagementContent;
