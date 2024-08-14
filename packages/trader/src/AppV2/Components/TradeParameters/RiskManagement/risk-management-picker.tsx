import React from 'react';
import { ActionSheet, Button, SegmentedControlSingleChoice } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import DealCancellation from './deal-cancellation';

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
                <React.Fragment>
                    <div>TP</div>
                    <div>SL</div>
                    <Button
                        color='black'
                        size='lg'
                        label={<Localize i18n_default_text='Save' />}
                        fullWidth
                        className='risk-management__save-button'
                        // onClick={() => console.log('Click')}
                    />
                </React.Fragment>
            )}
        </ActionSheet.Content>
    );
};

export default RiskManagementPicker;
