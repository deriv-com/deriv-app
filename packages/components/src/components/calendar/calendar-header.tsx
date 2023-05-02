import React from 'react';
import { addMonths, addYears, subMonths, subYears, toMoment } from '@deriv/shared';
import Button from './calendar-button';
import { getCentury, getDecade } from './helpers';

type THeaderProps = {
    calendar_date: moment.MomentInput;
    calendar_view: string;
    disable_month_selector?: boolean;
    disable_year_selector?: boolean;
    hide_disabled_periods?: boolean;
    isPeriodDisabled: (date: moment.MomentInput, unit: moment.unitOfTime.StartOf) => boolean;
    navigateTo: (new_date: moment.MomentInput) => void;
    switchView: (new_view: string) => void;
};

const Header = ({
    calendar_date,
    calendar_view,
    disable_month_selector,
    disable_year_selector,
    hide_disabled_periods,
    isPeriodDisabled,
    navigateTo,
    switchView,
}: THeaderProps) => {
    const is_date_view = calendar_view === 'date';
    const is_month_view = calendar_view === 'month';
    const is_year_view = calendar_view === 'year';
    const is_decade_view = calendar_view === 'years';
    const moment_date = toMoment(calendar_date);

    let num_of_years = 1;
    if (is_year_view) num_of_years = 10;
    if (is_decade_view) num_of_years = 100;

    const century = getCentury(moment_date.clone());
    const decade = getDecade(moment_date.clone());
    const end_of_decade = +(is_year_view ? decade : century).split('-')[1];

    const is_prev_month_disabled = isPeriodDisabled(subMonths(moment_date, 1), 'month');
    const is_prev_year_disabled = isPeriodDisabled(subYears(moment_date, num_of_years), 'month');
    const is_next_month_disabled = isPeriodDisabled(addMonths(moment_date, 1), 'month');
    const is_next_year_disabled = isPeriodDisabled(addYears(moment_date, num_of_years), 'month');
    const is_select_year_disabled =
        isPeriodDisabled(moment_date.clone().year(end_of_decade), 'year') || disable_year_selector;
    const should_hide_next_month = is_next_month_disabled && hide_disabled_periods;
    const should_hide_prev_month = is_prev_month_disabled && hide_disabled_periods;
    const should_hide_prev_year = is_prev_year_disabled && hide_disabled_periods;
    const should_hide_next_year = is_next_year_disabled && hide_disabled_periods;

    const onClickPrevYear = !(is_prev_year_disabled || should_hide_prev_year)
        ? () => navigateTo(subYears(calendar_date, num_of_years))
        : undefined;

    const onClickNextYear = !(is_next_year_disabled || should_hide_next_year)
        ? () => navigateTo(addYears(calendar_date, num_of_years))
        : undefined;

    const onClickPrevMonth = !(is_prev_month_disabled || should_hide_prev_month)
        ? () => navigateTo(subMonths(calendar_date, 1))
        : undefined;

    const onClickNextMonth = !(is_next_month_disabled || should_hide_next_month)
        ? () => navigateTo(addMonths(calendar_date, 1))
        : undefined;

    return (
        <div className='dc-calendar__header'>
            <Button
                className='dc-calendar__btn--prev-year'
                icon='IcChevronDoubleLeft'
                is_disabled={is_prev_year_disabled}
                is_hidden={should_hide_prev_year}
                onClick={onClickPrevYear}
            />
            <Button
                className='dc-calendar__btn--prev-month'
                icon='IcChevronLeft'
                is_disabled={is_prev_month_disabled}
                is_hidden={!is_date_view || should_hide_prev_month}
                onClick={onClickPrevMonth}
            />

            <>
                {is_date_view && (
                    <Button
                        className='dc-calendar__btn--select'
                        is_hidden={!is_date_view}
                        label={moment_date.format('MMM')}
                        onClick={() => (disable_month_selector ? undefined : switchView('month'))}
                    />
                )}
                {(is_date_view || is_month_view) && (
                    <Button
                        className='dc-calendar__btn--select'
                        is_disabled={is_select_year_disabled}
                        label={moment_date.format('YYYY')}
                        onClick={() => (is_select_year_disabled ? undefined : switchView('year'))}
                    />
                )}
                {(is_year_view || is_decade_view) && (
                    <Button
                        className='dc-calendar__btn--select'
                        is_disabled={is_select_year_disabled}
                        onClick={is_select_year_disabled ? undefined : () => switchView('years')}
                    >
                        {is_year_view && `${decade}`}
                        {is_decade_view && `${century}`}
                    </Button>
                )}
            </>

            <Button
                className='dc-calendar__btn--next-month'
                icon='IcChevronRight'
                is_disabled={is_next_month_disabled}
                is_hidden={!is_date_view || should_hide_next_month}
                onClick={onClickNextMonth}
            />
            <Button
                className='dc-calendar__btn--next-year'
                icon='IcChevronDoubleRight'
                is_disabled={is_next_year_disabled}
                is_hidden={should_hide_next_year}
                onClick={onClickNextYear}
            />
        </div>
    );
};

export default Header;
