import React from 'react';
import { ActionSheet, SegmentedControlSingleChoice } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import DealCancellation from './deal-cancellation';
import TakeProfitAndStopLossContainer from './take-profit-and-stop-loss-container';

type TRiskManagementPickerProps = {
    closeActionSheet: () => void;
    should_show_deal_cancellation?: boolean;
};

const RiskManagementPicker = ({ closeActionSheet, should_show_deal_cancellation }: TRiskManagementPickerProps) => {
    const [tab_index, setTabIndex] = React.useState(0);

    return (
        <ActionSheet.Content className='risk-management__picker'>
            {should_show_deal_cancellation && (
                <SegmentedControlSingleChoice
                    hasContainerWidth
                    onChange={setTabIndex}
                    options={[
                        { label: <Localize i18n_default_text='TP & SL' /> },
                        { label: <Localize i18n_default_text='Deal cancellation' /> },
                    ]}
                    size='sm'
                    selectedItemIndex={tab_index}
                />
            )}
            {tab_index ? (
                <DealCancellation closeActionSheet={closeActionSheet} />
            ) : (
                <TakeProfitAndStopLossContainer closeActionSheet={closeActionSheet} />
            )}
        </ActionSheet.Content>
    );
};

export default RiskManagementPicker;
