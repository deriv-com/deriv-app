import PropTypes from 'prop-types';
import React from 'react';
import Loadable from 'react-loadable';
import { DesktopWrapper, InputField, MobileWrapper, useOnClickOutside } from '@deriv/components';
import { localize } from '@deriv/translations';
import { daysFromTodayTo, epochToMoment, toMoment } from '@deriv/shared';
import { connect } from 'Stores/connect';
import CompositeCalendarMobile from './composite-calendar-mobile.jsx';
import SideList from './side-list.jsx';
import CalendarIcon from './calendar-icon.jsx';

const TwoMonthPicker = Loadable({
    loader: () => import(/* webpackChunkName: "two-month-picker" */ './two-month-picker.jsx'),
    loading: () => null,
    render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} />;
    },
});

const CompositeCalendar = props => {
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

    const wrapper_ref = React.useRef();

    useOnClickOutside(wrapper_ref, event => {
        event.stopPropagation();
        event.preventDefault();
        hideCalendar();
    });

    const selectDateRange = new_from => {
        hideCalendar();
        applyBatch({
            from: new_from ? toMoment().startOf('day').subtract(new_from, 'day').add(1, 's').unix() : null,
            to: toMoment().endOf('day').unix(),
            is_batch: true,
        });
    };

    const getToDateLabel = () => {
        const date = epochToMoment(to);
        return daysFromTodayTo(date) === 0 ? localize('Today') : date.format('MMM, DD YYYY');
    };

    const getFromDateLabel = () => {
        const date = epochToMoment(from);
        return from ? date.format('MMM, DD YYYY') : '';
    };

    const hideCalendar = () => {
        setShowFrom(false);
        setShowTo(false);
    };

    const showCalendar = e => {
        if (e === 'from') {
            setShowFrom(true);
        }
        if (e === 'to') {
            setShowTo(true);
        }
    };

    const setToDate = date => {
        updateState('to', epochToMoment(date).endOf('day').unix());
    };

    const setFromDate = date => {
        updateState('from', date);
        hideCalendar();
    };

    const updateState = (key, value) => {
        apply(key, value);
        hideCalendar();
    };

    const applyBatch = values => {
        onChange(values);
    };

    const apply = (key, value) => {
        applyBatch({
            [key]: value,
        });
    };

    const isPeriodDisabledTo = date => {
        return date + 1 <= from || date > toMoment().endOf('day').unix();
    };

    const isPeriodDisabledFrom = date => {
        return date - 1 >= to;
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
                        <TwoMonthPicker value={to} onChange={setToDate} isPeriodDisabled={isPeriodDisabledTo} />
                    </div>
                )}
                {show_from && (
                    <div className='composite-calendar' ref={wrapper_ref}>
                        <SideList from={from} to={to} items={list} />
                        <TwoMonthPicker value={from} onChange={setFromDate} isPeriodDisabled={isPeriodDisabledFrom} />
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

CompositeCalendar.propTypes = {
    current_focus: PropTypes.string,
    from: PropTypes.number,
    onChange: PropTypes.func,
    setCurrentFocus: PropTypes.func,
    to: PropTypes.number,
};
export default React.memo(
    connect(({ ui }) => ({
        current_focus: ui.current_focus,
        setCurrentFocus: ui.setCurrentFocus,
    }))(CompositeCalendar)
);
