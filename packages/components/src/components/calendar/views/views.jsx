import React from 'react';
import Days from './calendar-days.jsx';
import Months from './calendar-months.jsx';
import Years from './calendar-years.jsx';
import Decades from './calendar-decades.jsx';

const Views = ({ children }) => <>{children}</>;

Views.Days = Days;
Views.Months = Months;
Views.Years = Years;
Views.Decades = Decades;

export default Views;
