import React from 'react';
import Views from './views';
import { CommonPropTypes } from './views/types';

type TBodyProps = CommonPropTypes & {
    calendar_view: string;
    date_format: string;
    disabled_days?: number[];
    start_date?: string;
    events?: Array<{
        dates: string[];
        descrip: string;
    }>;
    has_range_selection?: boolean;
    hide_others?: boolean;
    hovered_date?: string | null;
    onMouseLeave?: React.MouseEventHandler<HTMLSpanElement>;
    onMouseOver?: React.MouseEventHandler<HTMLSpanElement>;
    should_show_today?: boolean;
};

const Body = (props: TBodyProps) => {
    const calendar_body: Record<string, React.ReactElement> = {
        date: <Views.Days {...props} />,
        month: <Views.Months {...props} />,
        year: <Views.Years {...props} />,
        years: <Views.Decades {...props} />,
    };

    return <React.Fragment>{calendar_body[props.calendar_view]}</React.Fragment>;
};

export default Body;
