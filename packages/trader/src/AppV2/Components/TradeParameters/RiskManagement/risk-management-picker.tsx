import React from 'react';
// import { observer } from 'mobx-react';
// import { useTraderStore } from 'Stores/useTraderStores';
import { ActionSheet, SegmentedControlSingleChoice } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
// import { Skeleton } from '@deriv/components';
import DealCancellation from './deal-cancellation';

type TRiskManagementPickerProps = {
    should_show_deal_cancellation?: boolean;
};

const RiskManagementPicker = ({ should_show_deal_cancellation }: TRiskManagementPickerProps) => {
    const [tab_index, setTabIndex] = React.useState(0);

    const onSave = () => {
        // console.log('onSave')
    };

    return (
        <React.Fragment>
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
                    <DealCancellation />
                ) : (
                    <React.Fragment>
                        <div>TP</div>
                        <div>SL</div>
                    </React.Fragment>
                )}
            </ActionSheet.Content>
            <ActionSheet.Footer
                alignment='vertical'
                primaryAction={{
                    content: <Localize i18n_default_text='Save' />,
                    onAction: onSave,
                }}
            />
        </React.Fragment>
    );
};

export default RiskManagementPicker;
