import React, { type ReactElement } from 'react';
import { toMoment } from '@deriv/shared';
import DatePicker from '../date-picker';

type TDateOfBirthPicker = {
    error_messages: string[];
    label: string;
    is_alignment_top: boolean;
    date_format: string;
    disabled: boolean;
    mode: string;
    max_date: moment.Moment;
    min_date: moment.Moment;
    start_date: moment.Moment;
    name: string;
    onFocus: () => void;
    portal_id: string;
    placeholder: string;
    required: boolean;
    type: string;
    value: moment.Moment | string;
    data_testid: string;
    display_format: string;
    error: string;
    footer: ReactElement;
    id: string;
    has_range_selection: boolean;
    onBlur: () => void;
    onChange: ({
        date,
        duration,
        target,
    }: {
        date?: string;
        duration?: number | null | string;
        target?: { name: string; value: number | string | moment.Moment | null };
    }) => void;
    alignment: string;
    keep_open: boolean;
};

const DateOfBirthPicker = (props: TDateOfBirthPicker) => {
    const [max_date] = React.useState(toMoment().subtract(18, 'years'));
    const [min_date] = React.useState(toMoment().subtract(100, 'years'));
    return <DatePicker {...props} display_format='DD-MM-YYYY' max_date={max_date} min_date={min_date} />;
};

export default DateOfBirthPicker;
