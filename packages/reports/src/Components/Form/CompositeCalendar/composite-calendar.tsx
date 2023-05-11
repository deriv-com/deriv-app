import React from 'react';
import Loadable from 'react-loadable';
import { DesktopWrapper, InputField, MobileWrapper, useOnClickOutside } from '@deriv/components';
import { localize } from '@deriv/translations';
import { daysFromTodayTo, toMoment } from '@deriv/shared';
import { connect } from 'Stores/connect';
import type { TStores } from '@deriv/stores';
import CompositeCalendarMobile from './composite-calendar-mobile';
import SideList from './side-list';
import CalendarIcon from './calendar-icon';
import TwoMonthPicker from './two-month-picker';
import moment from 'moment';

type TCompositeCalendar = {
    current_focus: string;
    onChange: (values: { [key: string]: moment.Moment }) => void;
    setCurrentFocus: () => void;
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

const CompositeCalendar: React.FC<TCompositeCalendar> = props => {
    const { current_focus, onChange, setCurrentFocus, to, from } = props;

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
        applyBatch({
            from: new_from ? toMoment().startOf('day').subtract(new_from, 'day').add(1, 's').unix() : null,
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
        event => {
            event?.stopPropagation();
            event?.preventDefault();
            hideCalendar();
        },
        validateClickOutside
    );

    const setToDate = (date: moment.Moment) => {
        updateState('to', toMoment(date).endOf('day'));
    };

    const setFromDate = (date: moment.Moment) => {
        updateState('from', date.unix());
        hideCalendar();
    };

    const updateState = (key: string, value: moment.Moment | number) => {
        apply(key, value);
        hideCalendar();
    };

    const applyBatch = (values: { [key: string]: any }) => {
        onChange(values);
    };

    const apply = (key: string, value: any) => {
        applyBatch({
            [key]: value,
        });
    };

    const isPeriodDisabledTo = (date: moment.Moment) => {
        return date.clone().add(1, 'days').isSameOrBefore(from) || date.isAfter(toMoment().endOf('day'));
    };

    const isPeriodDisabledFrom = (date: moment.Moment) => {
        return moment(date).subtract(1, 'days').isSameOrAfter(to);
    };

    return (
        <React.Fragment>
            <DesktopWrapper>
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
            </DesktopWrapper>
            <MobileWrapper>
                <CompositeCalendarMobile duration_list={list} {...props} />
            </MobileWrapper>
        </React.Fragment>
    );
};

CompositeCalendar.displayName = 'CompositeCalendar';

export default React.memo(
    connect(({ ui }: TStores) => ({
        current_focus: ui.current_focus,
        setCurrentFocus: ui.setCurrentFocus,
    }))(CompositeCalendar)
);
