import React from 'react';
import moment from 'moment';
import Loadable from 'react-loadable';
import { DesktopWrapper, InputField, MobileWrapper, useOnClickOutside } from '@deriv/components';
import { daysFromTodayTo, toMoment } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import CalendarIcon from './calendar-icon';
import CalendarSideList from './calendar-side-list';
import CompositeCalendarMobile from './composite-calendar-mobile';

export type TInputDateRange = {
    value?: string;
    label?: string;
    duration?: number;
    onClick?: () => void;
};

type TCompositeCalendarProps = {
    input_date_range: TInputDateRange;
    onChange: (values: { to?: moment.Moment; from?: moment.Moment; is_batch?: boolean }) => void;
    to: number;
    from: number;
};

const TwoMonthPickerLoadable = Loadable({
    loader: () => import(/* webpackChunkName: "two-month-picker" */ './two-month-picker'),
    loading: () => null,
    render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} />;
    },
});

const CompositeCalendar = (props: TCompositeCalendarProps) => {
    const { ui } = useStore();
    const { current_focus, setCurrentFocus } = ui;
    const { from, to, onChange } = props;

    const [show_to, setShowTo] = React.useState(false);
    const [show_from, setShowFrom] = React.useState(false);
    const [days_duration_list] = React.useState([
        {
            value: 'all_time',
            label: localize('All time'),
            onClick: () => selectDateRange(),
            duration: 0,
        },
        {
            value: 'today',
            label: localize('Today'),
            onClick: () => selectDateRange(1),
            duration: 1,
        },
        {
            value: 'last_7_days',
            label: localize('Last 7 days'),
            onClick: () => selectDateRange(7),
            duration: 7,
        },
        {
            value: 'last_30_days',
            label: localize('Last 30 days'),
            onClick: () => selectDateRange(30),
            duration: 30,
        },
        {
            value: 'last_60_days',
            label: localize('Last 60 days'),
            onClick: () => selectDateRange(60),
            duration: 60,
        },
        {
            value: 'last_quarter',
            label: localize('Last quarter'),
            onClick: () => selectDateRange(90),
            duration: 90,
        },
    ]);

    const wrapper_ref = React.useRef<HTMLInputElement>(null);

    const validateClickOutside = (event: MouseEvent) => !wrapper_ref.current?.contains(event.target as Node);

    const selectDateRange = (new_from?: number) => {
        hideCalendar();
        onChange({
            from: new_from ? toMoment().startOf('day').subtract(new_from, 'day').add(1, 's') : undefined,
            to: toMoment().endOf('day'),
            is_batch: true,
        });
    };

    const getToDateLabel = () => {
        const date = toMoment(to);
        return daysFromTodayTo(date) === 0 ? localize('Today') : date.format('MMM, DD YYYY');
    };

    const getFromDateLabel = () => {
        const date = toMoment(from);
        return from ? date.format('MMM, DD YYYY') : '';
    };

    const hideCalendar = () => {
        setShowFrom(false);
        setShowTo(false);
    };

    const showCalendar = (e: string) => {
        if (e === 'from') {
            setShowFrom(true);
        }
        if (e === 'to') {
            setShowTo(true);
        }
    };

    useOnClickOutside(
        wrapper_ref,
        (event: MouseEvent) => {
            event?.stopPropagation();
            event?.preventDefault();
            hideCalendar();
        },
        validateClickOutside
    );

    const setToDate = (date: moment.Moment) => {
        onChange({ to: toMoment(date).endOf('day') });
    };

    const setFromDate = (date: moment.Moment) => {
        onChange({ from: toMoment(date) });
        hideCalendar();
    };

    const isPeriodDisabledTo = (date: moment.Moment) => {
        return date.unix() < from || date.unix() > toMoment().endOf('day').unix();
    };

    const isPeriodDisabledFrom = (date: moment.Moment) => date.unix() > to;

    return (
        <React.Fragment>
            <DesktopWrapper>
                <div className='composite-calendar__input-fields'>
                    <InputField
                        current_focus={current_focus}
                        data_testid='dt_calendar_input_from'
                        icon={CalendarIcon}
                        is_read_only
                        name='from_date'
                        onClick={() => showCalendar('from')}
                        placeholder={localize('Date from')}
                        setCurrentFocus={setCurrentFocus}
                        value={getFromDateLabel()}
                    />
                    <InputField
                        current_focus={current_focus}
                        data_testid='dt_calendar_input_to'
                        icon={CalendarIcon}
                        is_read_only
                        name='to_date'
                        onClick={() => showCalendar('to')}
                        placeholder={localize('Date to')}
                        setCurrentFocus={setCurrentFocus}
                        value={getToDateLabel()}
                    />
                </div>
                {show_to && (
                    <div className='composite-calendar' ref={wrapper_ref}>
                        <CalendarSideList from={from} to={to} items={days_duration_list} />
                        <TwoMonthPickerLoadable value={to} onChange={setToDate} isPeriodDisabled={isPeriodDisabledTo} />
                    </div>
                )}
                {show_from && (
                    <div className='composite-calendar' ref={wrapper_ref}>
                        <CalendarSideList from={from} to={to} items={days_duration_list} />
                        <TwoMonthPickerLoadable
                            value={from}
                            onChange={setFromDate}
                            isPeriodDisabled={isPeriodDisabledFrom}
                        />
                    </div>
                )}
            </DesktopWrapper>
            <MobileWrapper>
                <CompositeCalendarMobile
                    duration_list={days_duration_list}
                    current_focus={current_focus}
                    setCurrentFocus={setCurrentFocus}
                    {...props}
                />
            </MobileWrapper>
        </React.Fragment>
    );
};

export default React.memo(observer(CompositeCalendar));
