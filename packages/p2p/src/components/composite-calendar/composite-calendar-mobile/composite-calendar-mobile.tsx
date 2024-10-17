import React from 'react';
import { DatePicker, InputField, MobileDialog } from '@deriv/components';
import { toMoment } from '@deriv/shared';
import { localize } from 'Components/i18next';
import CompositeCalendarMobileFooter from './composite-calendar-mobile-footer';
import CalendarRadioButton from '../calendar-radio-buton';
import { TInputDateRange } from '../composite-calendar';
import CalendarIcon from '../calendar-icon';

const CUSTOM_KEY = 'custom';

type TCompositeCalendarMobileProps = {
    current_focus?: string | null;
    duration_list?: Array<TInputDateRange>;
    input_date_range?: TInputDateRange;
    onChange: (
        value: { from?: moment.Moment; to?: moment.Moment; is_batch?: boolean },
        extra_data?: { date_range: TInputDateRange }
    ) => void;
    setCurrentFocus?: (focus: string) => void;
    from: number;
    to: number;
};

const CompositeCalendarMobile = ({
    current_focus,
    duration_list,
    input_date_range,
    onChange,
    setCurrentFocus,
    from,
    to,
}: TCompositeCalendarMobileProps) => {
    const date_range = input_date_range ?? duration_list?.find(range => range.value === 'all_time');

    const [from_date, setFrom] = React.useState(from ? toMoment(from).format('YYYY-MM-DD') : undefined);
    const [to_date, setTo] = React.useState(to ? toMoment(to).format('YYYY-MM-DD') : undefined);
    const [is_open, setIsOpen] = React.useState(false);
    const [is_ok_btn_disabled, setIsOkBtnDisabled] = React.useState(true);

    const [applied_date_range, setAppliedDateRange] = React.useState(date_range);
    const [selected_date_range, setSelectedDateRange] = React.useState(date_range);
    const has_custom_date_range_selected = selected_date_range?.value === CUSTOM_KEY;
    const today = toMoment().format('YYYY-MM-DD');

    const selectDateRange = (selected_date_range: TInputDateRange, is_today?: boolean) => {
        const new_from = selected_date_range.duration;
        onChange(
            {
                from:
                    is_today || new_from ? toMoment().startOf('day').subtract(new_from, 'day').add(1, 's') : undefined,
                to: toMoment().endOf('day'),
                is_batch: true,
            },
            {
                date_range: selected_date_range,
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
        if (has_custom_date_range_selected) {
            selectCustomDateRange();
        } else {
            selectDateRange(selected_date_range);
        }
        setAppliedDateRange(selected_date_range);
        setIsOpen(false);
        setIsOkBtnDisabled(true);
    };

    const selectDate = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        setSelectedDateRange({ value: CUSTOM_KEY });

        if (key === 'from') setFrom(e.target?.value);
        else setTo(e.target?.value);
    };

    const onDateRangeChange = (date_range: TInputDateRange) => {
        if (date_range.value !== CUSTOM_KEY || (from_date && to_date)) setIsOkBtnDisabled(false);
        else setIsOkBtnDisabled(true);

        setSelectedDateRange(
            duration_list?.find(range => date_range && range.value === date_range.value) ?? date_range
        );
    };

    const openDialog = () => {
        setSelectedDateRange(applied_date_range);
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
        setIsOkBtnDisabled(true);
    };

    React.useEffect(() => {
        if (from_date && to_date) setIsOkBtnDisabled(false);
        else setIsOkBtnDisabled(true);
    }, [from_date, to_date]);

    return (
        <React.Fragment>
            <div className='composite-calendar__input-fields composite-calendar__input-fields--fill'>
                <InputField
                    id='dt_calendar_input'
                    current_focus={current_focus}
                    is_read_only
                    icon={CalendarIcon}
                    onClick={openDialog}
                    setCurrentFocus={setCurrentFocus}
                    value={applied_date_range?.label}
                />
            </div>
            <MobileDialog
                portal_element_id='modal_root'
                title={localize('Please select duration')}
                visible={is_open}
                has_content_scroll
                header_classname='composite-calendar-mobile__header'
                onClose={closeDialog}
                content_height_offset='94px'
                footer={
                    <CompositeCalendarMobileFooter
                        applyDateRange={applyDateRange}
                        is_ok_btn_disabled={is_ok_btn_disabled}
                        onCancel={closeDialog}
                    />
                }
            >
                <div className='composite-calendar-mobile'>
                    <div className='composite-calendar-mobile__radio-group'>
                        {duration_list?.map(({ value, label }) => (
                            <CalendarRadioButton
                                id={`composite-calendar-mobile__radio__${value}`}
                                key={value}
                                value={value ?? ''}
                                label={label ?? ''}
                                selected_value={selected_date_range?.value}
                                onChange={onDateRangeChange}
                            />
                        ))}
                    </div>
                    <div className='composite-calendar-mobile__custom'>
                        <CalendarRadioButton
                            id={'composite-calendar-mobile__custom-radio'}
                            className='composite-calendar-mobile__custom-radio'
                            value={CUSTOM_KEY}
                            label={localize('Custom')}
                            selected_value={selected_date_range?.value}
                            onChange={onDateRangeChange}
                        />
                        <div className='composite-calendar-mobile__custom-date-range'>
                            <DatePicker
                                className='composite-calendar-mobile__custom-date-range-start-date'
                                disabled={!has_custom_date_range_selected}
                                is_nativepicker
                                placeholder={localize('Start date')}
                                value={from_date}
                                max_date={to_date || today}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => selectDate(e, 'from')}
                            />
                            <DatePicker
                                className='composite-calendar-mobile__custom-date-range-end-date'
                                disabled={!has_custom_date_range_selected}
                                is_nativepicker
                                placeholder={localize('End date')}
                                value={to_date}
                                max_date={today}
                                min_date={from_date}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => selectDate(e, 'to')}
                            />
                        </div>
                    </div>
                </div>
            </MobileDialog>
        </React.Fragment>
    );
};

export default React.memo(CompositeCalendarMobile);
