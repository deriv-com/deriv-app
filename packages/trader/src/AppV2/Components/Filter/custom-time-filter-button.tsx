import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import { LabelPairedChevronRightSmBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';

type TCustomDateFilterButton = {
    setShowDatePicker: React.Dispatch<React.SetStateAction<boolean>>;
    selectedRangeDateString?: string;
};

const CustomDateFilterButton = ({ setShowDatePicker, selectedRangeDateString }: TCustomDateFilterButton) => (
    <button className='custom-time-filter__wrapper' onClick={() => setShowDatePicker(true)}>
        <Text size='md' className='custom-time-filter__label'>
            <Localize i18n_default_text='Custom' />
        </Text>
        {selectedRangeDateString && (
            <Text size='sm' color='quill-typography__color--subtle'>
                {selectedRangeDateString}
            </Text>
        )}
        <LabelPairedChevronRightSmBoldIcon className='custom-time-filter__icon' />
    </button>
);

export default CustomDateFilterButton;
