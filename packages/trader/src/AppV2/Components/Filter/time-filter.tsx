import React from 'react';
import Chip from 'AppV2/Components/Chip';
import { toMoment } from '@deriv/shared';
import { ActionSheet, RadioGroup } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import CustomDateFilterButton from './custom-time-filter-button';
import DateRangePicker from 'AppV2/Components/DatePicker';

type TTimeFilter = {
    handleDateChange: (values: { to?: moment.Moment; from?: moment.Moment; is_batch?: boolean }) => void;
    timeFilter?: string;
    setTimeFilter: (newTimeFilter?: string | undefined) => void;
    customTimeRangeFilter?: string;
    setCustomTimeRangeFilter: (newCustomTimeFilter?: string | undefined) => void;
    setNoMatchesFound: React.Dispatch<React.SetStateAction<boolean>>;
};

// TODO: replace strings with numbers when types in Quill be changed
const timeFilterList = [
    {
        value: '0',
        label: <Localize i18n_default_text='All time' />,
    },
    // TODO: Fix today and yesterday
    {
        value: '1',
        label: <Localize i18n_default_text='Today' />,
    },
    {
        value: '2',
        label: <Localize i18n_default_text='Yesterday' />,
    },
    {
        value: '7',
        label: <Localize i18n_default_text='Last 7 days' />,
    },
    {
        value: '30',
        label: <Localize i18n_default_text='Last 30 days' />,
    },
    {
        value: '60',
        label: <Localize i18n_default_text='Last 60 days' />,
    },
    {
        value: '90',
        label: <Localize i18n_default_text='Last 90 days' />,
    },
];

const TimeFilter = ({
    handleDateChange,
    timeFilter,
    setTimeFilter,
    customTimeRangeFilter,
    setCustomTimeRangeFilter,
    setNoMatchesFound,
}: TTimeFilter) => {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [showDatePicker, setShowDatePicker] = React.useState(false);

    const defaultCheckedTime = '0';
    const selectedRadioButtonValue = customTimeRangeFilter || timeFilter || defaultCheckedTime;
    const isChipSelected = !!(customTimeRangeFilter || timeFilter);

    const onRadioButtonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === defaultCheckedTime) {
            onReset();
            return;
        }
        setTimeFilter(value);
        setIsDropdownOpen(false);
        handleDateChange({
            from: Number(value) ? toMoment().startOf('day').subtract(Number(value), 'day').add(1, 's') : undefined,
            to: toMoment().endOf('day'),
            is_batch: true,
        });
    };

    const onReset = () => {
        setTimeFilter('');
        setCustomTimeRangeFilter('');
        setIsDropdownOpen(false);
        handleDateChange({
            from: Number(defaultCheckedTime)
                ? toMoment().startOf('day').subtract(Number(defaultCheckedTime), 'day').add(1, 's')
                : undefined,
            to: toMoment().endOf('day'),
            is_batch: true,
        });
        setNoMatchesFound(false);
    };

    const chipLabelFormatting = () =>
        customTimeRangeFilter || timeFilterList.find(item => item.value === (timeFilter || defaultCheckedTime))?.label;

    return (
        <React.Fragment>
            <Chip
                label={chipLabelFormatting()}
                dropdown
                isDropdownOpen={isDropdownOpen}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                selected={isChipSelected}
                size='sm'
            />
            <ActionSheet.Root isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} position='left'>
                <ActionSheet.Portal>
                    <ActionSheet.Header title={<Localize i18n_default_text='Filter by trade types' />} />
                    <ActionSheet.Content className='filter__item__wrapper'>
                        <RadioGroup
                            selected={selectedRadioButtonValue}
                            onToggle={onRadioButtonChange}
                            size='sm'
                            className='filter__item--radio'
                        >
                            {timeFilterList.map(({ value, label }) => (
                                <RadioGroup.Item value={value} label={label} key={value} radioButtonPosition='right' />
                            ))}
                        </RadioGroup>
                        <CustomDateFilterButton
                            setShowDatePicker={setShowDatePicker}
                            customTimeRangeFilter={customTimeRangeFilter}
                        />
                    </ActionSheet.Content>
                    <ActionSheet.Footer
                        secondaryAction={{
                            content: 'Reset',
                            onAction: onReset,
                        }}
                        alignment='vertical'
                        shouldCloseOnSecondaryButtonClick={false}
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
            {showDatePicker && (
                <DateRangePicker
                    isOpen={showDatePicker}
                    onClose={() => setShowDatePicker(false)}
                    setCustomTimeRangeFilter={setCustomTimeRangeFilter}
                    handleDateChange={handleDateChange}
                />
            )}
        </React.Fragment>
    );
};

export default TimeFilter;
