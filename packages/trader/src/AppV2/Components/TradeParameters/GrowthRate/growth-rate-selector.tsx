import React from 'react';
import { ActionSheet } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';

type TGrowthRateSelectorProps = {
    accumulator_range_list?: number[];
    growth_rate: number;
    onSave: () => void;
};

const GrowthRateSelector = ({ accumulator_range_list = [], growth_rate, onSave }: TGrowthRateSelectorProps) => {
    if (!accumulator_range_list.length) return null;
    return (
        <React.Fragment>
            <ActionSheet.Content className='take-profit__wrapper'>{/* wheelpicker */}</ActionSheet.Content>
            <ActionSheet.Footer
                alignment='vertical'
                primaryAction={{
                    content: <Localize i18n_default_text='Save' />,
                    onAction: onSave,
                }}
                shouldCloseOnPrimaryButtonClick={false}
            />
        </React.Fragment>
    );
};

GrowthRateSelector.displayName = 'GrowthRateSelector';

export default GrowthRateSelector;
