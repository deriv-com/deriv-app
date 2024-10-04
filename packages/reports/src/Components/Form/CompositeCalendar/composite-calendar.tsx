import React from 'react';
import Loadable from 'react-loadable';
import { useDevice } from '@deriv-com/ui';
import { InputField, useOnClickOutside } from '@deriv/components';
import { localize } from '@deriv/translations';
import { daysFromTodayTo, toMoment } from '@deriv/shared';
import CompositeCalendarMobile from './composite-calendar-mobile';
import SideList from './side-list';
import CalendarIcon from './calendar-icon';
import TwoMonthPicker from './two-month-picker';
import moment from 'moment';
import { observer, useStore } from '@deriv/stores';

type TCompositeCalendar = {
    onChange: (values: { to?: moment.Moment; from?: moment.Moment; is_batch?: boolean }) => void;
    to: number;
    from: number;
};

type TTwoMonthPickerLoadable = {
    onChange: (date: moment.Moment) => void;
    isPeriodDisabled: (date: moment.Moment) => boolean;
    value: number;
};

const TwoMonthPickerLoadable = Loadable<TTwoMonthPickerLoadable, typeof TwoMonthPicker>({
    loader: () => import(/* webpackChunkName: "two-month-picker" */ './two-month-picker'),
    loading: () => null,
    render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} />;
    },
});

const CompositeCalendar = observer((props: TCompositeCalendar) => {
    const { ui } = useStore();
    const { current_focus, setCurrentFocus } = ui;
    const { onChange, to, from } = props;
    const { isDesktop } = useDevice();
    const [show_to, setShowTo] = React.useState(false);
    const [show_from, setShowFrom] = React.useState(false);
    const [list] = React.useState([
        {
            value: 'all_time',
            label: localize('All time'),
            onClick: () => selectDateRange(),
            duration: 0,
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
        (event: React.MouseEvent) => {
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

    if (isDesktop) {
        return (
            <React.Fragment>
                <div id='dt_composite_calendar_inputs' className='composite-calendar__input-fields'>
                    <InputField
                        id='dt_calendar_input_from'
                        current_focus={current_focus}
                        is_read_only
                        placeholder={localize('Date from')}
                        icon={CalendarIcon}
                        onClick={() => showCalendar('from')}
                        setCurrentFocus={setCurrentFocus}
                        value={getFromDateLabel()}
                    />
                    <InputField
                        id='dt_calendar_input_to'
                        current_focus={current_focus}
                        is_read_only
                        placeholder={localize('Date to')}
                        icon={CalendarIcon}
                        onClick={() => showCalendar('to')}
                        setCurrentFocus={setCurrentFocus}
                        value={getToDateLabel()}
                    />
                </div>
                {show_to && (
                    <div className='composite-calendar' ref={wrapper_ref}>
                        <SideList from={from} to={to} items={list} />
                        <TwoMonthPickerLoadable value={to} onChange={setToDate} isPeriodDisabled={isPeriodDisabledTo} />
                    </div>
                )}
                {show_from && (
                    <div className='composite-calendar' ref={wrapper_ref}>
                        <SideList from={from} to={to} items={list} />
                        <TwoMonthPickerLoadable
                            value={from}
                            onChange={setFromDate}
                            isPeriodDisabled={isPeriodDisabledFrom}
                        />
                    </div>
                )}
            </React.Fragment>
        );
    }

    return (
        <CompositeCalendarMobile
            duration_list={list}
            setCurrentFocus={setCurrentFocus}
            current_focus={current_focus}
            {...props}
        />
    );
});

CompositeCalendar.displayName = 'CompositeCalendar';

export default React.memo(CompositeCalendar);
