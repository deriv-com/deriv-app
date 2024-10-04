import classNames from 'classnames';
import React from 'react';
import { Button, DatePicker, Icon, InputField, MobileDialog, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { toMoment } from '@deriv/shared';
import { TInputDateRange } from 'Types';

type TDatePickerOnChangeParams = Parameters<React.ComponentProps<typeof DatePicker>['onChange']>[0];

type TRadioButton = {
    id: string;
    className?: string;
    selected_value?: string;
    value?: string;
    label?: string;
    onChange: (value: { label?: string; value?: string }) => void;
};

export const RadioButton = ({ id, className, selected_value, value, label, onChange }: TRadioButton) => {
    return (
        <label
            htmlFor={id}
            className={classNames('composite-calendar-modal__radio', className, {
                'composite-calendar-modal__radio--selected': selected_value === value,
            })}
            onClick={() => onChange({ label, value })}
        >
            <input className='composite-calendar-modal__radio-input' id={id} type='radio' value={value} />
            <span
                className={classNames('composite-calendar-modal__radio-circle', {
                    'composite-calendar-modal__radio-circle--selected': selected_value === value,
                })}
            />
            <Text
                as='p'
                color='prominent'
                size='xs'
                line_height='unset'
                weight={selected_value === value ? 'bold' : 'normal'}
            >
                {label}
            </Text>
        </label>
    );
};
const CUSTOM_KEY = 'custom';

type TCompositeCalendarMobile = {
    input_date_range?: TInputDateRange;
    current_focus?: string | null;
    duration_list?: Array<TInputDateRange>;
    onChange: (
        value: { from?: moment.Moment; to?: moment.Moment; is_batch?: boolean },
        extra_data?: { date_range: TInputDateRange }
    ) => void;
    setCurrentFocus: (focus: string | null) => void;
    from: number;
    to: number;
};

const CompositeCalendarMobile = React.memo(
    ({
        input_date_range,
        current_focus,
        duration_list,
        onChange,
        setCurrentFocus,
        from,
        to,
    }: TCompositeCalendarMobile) => {
        const date_range = input_date_range || duration_list?.find(range => range.value === 'all_time');

        const [from_date, setFrom] = React.useState(from ? toMoment(from).format('YYYY-MM-DD') : undefined);
        const [to_date, setTo] = React.useState(to ? toMoment(to).format('YYYY-MM-DD') : undefined);
        const [is_open, setIsOpen] = React.useState(false);

        const [applied_date_range, setAppliedDateRange] = React.useState(date_range);
        const [selected_date_range, setSelectedDateRange] = React.useState(date_range);
        const today = toMoment().format('YYYY-MM-DD');

        const selectDateRange = (_selected_date_range: TInputDateRange, is_today?: boolean) => {
            const new_from = _selected_date_range.duration;
            onChange(
                {
                    from:
                        is_today || new_from
                            ? toMoment().startOf('day').subtract(new_from, 'day').add(1, 's')
                            : undefined,
                    to: toMoment().endOf('day'),
                    is_batch: true,
                },
                {
                    date_range: _selected_date_range,
                }
            );
        };

        const selectCustomDateRange = () => {
            const new_from = from_date || to_date || today;
            const new_to = to_date || today;

            const new_date_range = Object.assign(selected_date_range as TInputDateRange, {
                label: `${toMoment(new_from).format('DD MMM YYYY')} - ${toMoment(new_to).format('DD MMM YYYY')}`,
            });

            onChange(
                {
                    from: toMoment(new_from).startOf('day').add(1, 's'),
                    to: toMoment(new_to).endOf('day'),
                    is_batch: true,
                },
                {
                    date_range: new_date_range,
                }
            );
        };

        const applyDateRange = () => {
            if (selected_date_range?.onClick) {
                selectDateRange(selected_date_range);
            } else if (selected_date_range?.value === CUSTOM_KEY) {
                selectCustomDateRange();
            }
            setAppliedDateRange(selected_date_range);
            setIsOpen(false);
        };

        const selectToday = () => {
            const new_date_range = {
                duration: 0,
                label: localize('Today'),
            };
            selectDateRange(new_date_range, true);
            setAppliedDateRange(new_date_range);
            setSelectedDateRange(new_date_range);
            setIsOpen(false);
        };

        const selectDate = (e: TDatePickerOnChangeParams, key: string) => {
            setSelectedDateRange({ value: CUSTOM_KEY });

            if (key === 'from') setFrom(e.target?.value as string);
            if (key === 'to') setTo(e.target?.value as string);
        };

        const getMobileFooter = () => {
            return (
                <div className='composite-calendar-modal__actions'>
                    <Button
                        className='composite-calendar-modal__actions__cancel'
                        text={localize('Cancel')}
                        onClick={() => setIsOpen(false)}
                        has_effect
                        secondary
                        large
                    />
                    <Button
                        className='composite-calendar-modal__actions__ok'
                        text={localize('OK')}
                        onClick={applyDateRange}
                        has_effect
                        primary
                        large
                    />
                </div>
            );
        };

        const onDateRangeChange = (_date_range: TInputDateRange) => {
            setSelectedDateRange(
                duration_list?.find(range => _date_range && range.value === _date_range.value) || _date_range
            );
        };

        const openDialog = () => {
            setSelectedDateRange(applied_date_range);
            setIsOpen(true);
        };

        return (
            <React.Fragment>
                <div className='composite-calendar__input-fields composite-calendar__input-fields--fill'>
                    <InputField
                        id='dt_calendar_input'
                        current_focus={current_focus ?? ''}
                        is_read_only={true}
                        icon={() => <Icon icon='IcCalendarDatefrom' className='inline-icon' />}
                        onClick={openDialog}
                        setCurrentFocus={setCurrentFocus}
                        value={applied_date_range?.label ?? ''}
                    />
                </div>
                <MobileDialog
                    portal_element_id='modal_root'
                    title={localize('Please select duration')}
                    visible={is_open}
                    has_content_scroll
                    onClose={() => setIsOpen(false)}
                    content_height_offset='94px'
                    footer={getMobileFooter()}
                >
                    <div className='composite-calendar-modal'>
                        <div className='composite-calendar-modal__radio-group'>
                            {duration_list?.map(duration => (
                                <RadioButton
                                    id={`composite-calendar-modal__radio__${duration.value}`}
                                    key={duration.value}
                                    value={duration.value}
                                    label={duration.label}
                                    selected_value={selected_date_range?.value}
                                    onChange={onDateRangeChange}
                                />
                            ))}
                        </div>
                        <div className='composite-calendar-modal__custom'>
                            <RadioButton
                                id={'composite-calendar-modal__custom-radio'}
                                className='composite-calendar-modal__custom-radio'
                                value={CUSTOM_KEY}
                                label={localize('Custom')}
                                selected_value={selected_date_range?.value}
                                onChange={onDateRangeChange}
                            />

                            <div className='composite-calendar-modal__custom-date-range'>
                                <DatePicker
                                    className='composite-calendar-modal__custom-date-range-start-date'
                                    placeholder={localize('Start date')}
                                    value={from_date ?? ''}
                                    max_date={to_date || today}
                                    onChange={(e: TDatePickerOnChangeParams) => selectDate(e, 'from')}
                                />
                                <DatePicker
                                    className='composite-calendar-modal__custom-date-range-end-date'
                                    placeholder={localize('End date')}
                                    value={to_date ?? ''}
                                    max_date={today}
                                    min_date={from_date}
                                    onChange={(e: TDatePickerOnChangeParams) => selectDate(e, 'to')}
                                />
                            </div>
                        </div>
                        <Button
                            className='composite-calendar-modal__actions-today'
                            text={localize('Back to today')}
                            onClick={selectToday}
                            has_effect
                            tertiary
                            large
                        />
                    </div>
                </MobileDialog>
            </React.Fragment>
        );
    }
);

CompositeCalendarMobile.displayName = 'CompositeCalendarMobile';
export default CompositeCalendarMobile;
