import React from 'react';
import { ActionSheet, Text, WheelPicker } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { Skeleton } from '@deriv/components';

const RiskManagementPicker = () => {
    const onSave = () => {
        // console.log('onSave')
    };

    return (
        <React.Fragment>
            <ActionSheet.Content className='risk-management__picker'>
                <div>Tabs</div>
                <div>TP</div>
                <div>SL</div>
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
