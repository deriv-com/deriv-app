import React from 'react';
import { ActionSheet, DatePicker } from '@deriv-com/quill-ui';
import { toMoment } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { DEFAULT_DATE_FORMATTING_CONFIG } from 'AppV2/Utils/positions-utils';

type TDateRangePicker = {
    handleDateChange: (values: { to?: moment.Moment; from?: moment.Moment; is_batch?: boolean }) => void;
    isOpen?: boolean;
    onClose: () => void;
    setCustomTimeRangeFilter: (newCustomTimeFilter?: string | undefined) => void;
};
const DateRangePicker = ({ handleDateChange, isOpen, onClose, setCustomTimeRangeFilter }: TDateRangePicker) => {
    const [chosenRangeString, setChosenRangeString] = React.useState<string>();
    const [chosenRange, setChosenRange] = React.useState<(string | null | Date)[] | null | Date>([]);

    const onApply = () => {
        setCustomTimeRangeFilter(chosenRangeString);
        if (Array.isArray(chosenRange) && chosenRange.length)
            handleDateChange({ from: toMoment(chosenRange[0]), to: toMoment(chosenRange[1]) });
        onClose();
    };

    return (
        <ActionSheet.Root isOpen={isOpen} onClose={onClose} position='left'>
            <ActionSheet.Portal>
                <ActionSheet.Header title={<Localize i18n_default_text='Choose a date range' />} />
                <ActionSheet.Content>
                    <DatePicker
                        className='date-picker__action-sheet'
                        locale='en-GB'
                        selectRange
                        onFormattedDate={value => setChosenRangeString(value)}
                        onChange={value => setChosenRange(value)}
                        optionsConfig={DEFAULT_DATE_FORMATTING_CONFIG}
                        tileDisabled={({ date }) => Date.parse(date.toDateString()) > Date.parse(toMoment().toString())}
                    />
                </ActionSheet.Content>
                <ActionSheet.Footer
                    alignment='vertical'
                    isPrimaryButtonDisabled={!chosenRangeString}
                    primaryAction={{
                        content: 'Apply',
                        onAction: onApply,
                    }}
                />
            </ActionSheet.Portal>
        </ActionSheet.Root>
    );
};

export default DateRangePicker;
