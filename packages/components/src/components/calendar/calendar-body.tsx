import React from 'react';
import Views from './views';

type BodyProps = {
    calendar_view: string;
};

const Body = (props: BodyProps) => {
    const calendar_body = {
        date: <Views.Days {...props} />,
        month: <Views.Months {...props} />,
        year: <Views.Years {...props} />,
        decade: <Views.Decades {...props} />,
    };

    return <>{calendar_body[props.calendar_view]}</>;
};

export default Body;
