import React from 'react';
import Chip from 'AppV2/Components/Chip';
import { toMoment } from '@deriv/shared';
import { ActionSheet, RadioGroup } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import CustomDateFilterButton from './custom-time-filter-button';
import DateRangePicker from 'AppV2/Components/DatePicker';

type TTimeFilter = {
    customTimeRangeFilter?: string;
    handleDateChange: (values: { to?: moment.Moment; from?: moment.Moment; is_batch?: boolean }) => void;
    setTimeFilter: (newTimeFilter?: string | undefined) => void;
    setCustomTimeRangeFilter: (newCustomTimeFilter?: string | undefined) => void;
    setNoMatchesFound: React.Dispatch<React.SetStateAction<boolean>>;
    timeFilter?: string;
};

const timeFilterList = [
    {
        value: '0',
        label: <Localize i18n_default_text='All time' />,
    },
    {
        value: 'Today',
        label: <Localize i18n_default_text='Today' />,
    },
    {
        value: 'Yesterday',
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
    customTimeRangeFilter,
    handleDateChange,
    setTimeFilter,
    setCustomTimeRangeFilter,
    setNoMatchesFound,
    timeFilter,
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

        if (value === 'Today') {
            handleDateChange({
                from: toMoment().startOf('day'),
                to: toMoment().endOf('day'),
                is_batch: true,
            });
        } else if (value === 'Yesterday') {
            handleDateChange({
                from: toMoment().subtract(1, 'days').startOf('day'),
                to: toMoment().subtract(1, 'days').endOf('day'),
                is_batch: true,
            });
        } else {
            handleDateChange({
                from: toMoment().startOf('day').subtract(Number(value), 'day').add(1, 's'),
                to: toMoment().endOf('day'),
                is_batch: true,
            });
        }
    };

    const onReset = () => {
        setTimeFilter('');
        setCustomTimeRangeFilter('');
        setIsDropdownOpen(false);
        handleDateChange({
            to: toMoment().endOf('day'),
            is_batch: true,
        });
        setNoMatchesFound(false);
    };

    const getChipLabel = () =>
        customTimeRangeFilter || timeFilterList.find(item => item.value === (timeFilter || defaultCheckedTime))?.label;

    return (
        <React.Fragment>
            <Chip
                dropdown
                isDropdownOpen={isDropdownOpen}
                label={getChipLabel()}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                selected={isChipSelected}
                size='sm'
            />
            <ActionSheet.Root isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} position='left'>
                <ActionSheet.Portal>
                    <ActionSheet.Header title={<Localize i18n_default_text='Filter by trade types' />} />
                    <ActionSheet.Content className='filter__item__wrapper'>
                        <RadioGroup
                            className='filter__item--radio'
                            onToggle={onRadioButtonChange}
                            selected={selectedRadioButtonValue}
                            size='sm'
                        >
                            {timeFilterList.map(({ value, label }) => (
                                <RadioGroup.Item value={value} label={label} key={value} radioButtonPosition='right' />
                            ))}
                        </RadioGroup>
                        <CustomDateFilterButton
                            customTimeRangeFilter={customTimeRangeFilter}
                            setShowDatePicker={setShowDatePicker}
                        />
                    </ActionSheet.Content>
                    <ActionSheet.Footer
                        alignment='vertical'
                        secondaryAction={{
                            content: <Localize i18n_default_text='Reset' />,
                            onAction: onReset,
                        }}
                        shouldCloseOnSecondaryButtonClick={false}
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
            {showDatePicker && (
                <DateRangePicker
                    handleDateChange={handleDateChange}
                    isOpen={showDatePicker}
                    onClose={() => {
                        setShowDatePicker(false);
                        setIsDropdownOpen(false);
                    }}
                    setCustomTimeRangeFilter={setCustomTimeRangeFilter}
                />
            )}
        </React.Fragment>
    );
};

export default TimeFilter;
