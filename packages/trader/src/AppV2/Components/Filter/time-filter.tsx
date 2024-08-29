import React from 'react';
import moment from 'moment';
import { toMoment } from '@deriv/shared';
import { ActionSheet, Chip, RadioGroup, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import CustomDateFilterButton from './custom-time-filter-button';
import DateRangePicker from 'AppV2/Components/DatePicker';

type TTimeFilter = {
    customTimeRangeFilter?: string;
    handleDateChange: (
        values: { to?: moment.Moment; from?: moment.Moment; is_batch?: boolean },
        otherParams?: {
            date_range?: Record<string, string | number>;
            shouldFilterContractTypes?: boolean;
        }
    ) => void;
    setTimeFilter: (newTimeFilter?: string | undefined) => void;
    setCustomTimeRangeFilter: (newCustomTimeFilter?: string | undefined) => void;
    setNoMatchesFound: React.Dispatch<React.SetStateAction<boolean>>;
    timeFilter?: string;
};

type TDateChangeArguments = Record<string, { from: moment.Moment; to: moment.Moment }>;

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

        const dateChangeArguments: TDateChangeArguments = {
            Today: {
                from: toMoment().startOf('day'),
                to: toMoment().endOf('day'),
            },
            Yesterday: {
                from: toMoment().subtract(1, 'days').startOf('day'),
                to: toMoment().subtract(1, 'days').endOf('day'),
            },
            default: {
                from: toMoment().startOf('day').subtract(Number(value), 'day').add(1, 's'),
                to: toMoment().endOf('day'),
            },
        };

        handleDateChange(
            { ...(dateChangeArguments[value] ?? dateChangeArguments.default), is_batch: true },
            {
                shouldFilterContractTypes: true,
            }
        );
    };

    const onReset = () => {
        setTimeFilter('');
        setCustomTimeRangeFilter('');
        setIsDropdownOpen(false);
        handleDateChange(
            {
                to: toMoment().endOf('day'),
                is_batch: true,
            },
            { shouldFilterContractTypes: true }
        );
        setNoMatchesFound(false);
    };

    const getChipLabel = () =>
        customTimeRangeFilter || timeFilterList.find(item => item.value === (timeFilter || defaultCheckedTime))?.label;

    return (
        <React.Fragment>
            <Chip.Standard
                className='filter__chip'
                dropdown
                isDropdownOpen={isDropdownOpen}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                selected={isChipSelected}
                size='md'
            >
                <Text size='sm'>{getChipLabel()}</Text>
            </Chip.Standard>
            <ActionSheet.Root
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                position='left'
                expandable={false}
            >
                <ActionSheet.Portal shouldCloseOnDrag>
                    <ActionSheet.Header title={<Localize i18n_default_text='Filter by time' />} />
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
                    applyHandler={() => {
                        setShowDatePicker(false);
                        setIsDropdownOpen(false);
                    }}
                    handleDateChange={handleDateChange}
                    isOpen={showDatePicker}
                    onClose={() => setShowDatePicker(false)}
                    setCustomTimeRangeFilter={setCustomTimeRangeFilter}
                />
            )}
        </React.Fragment>
    );
};

export default TimeFilter;
