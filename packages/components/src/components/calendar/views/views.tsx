import React from 'react';
import Days from './calendar-days';
import Months from './calendar-months';
import Years from './calendar-years';
import Decades from './calendar-decades';

const Views = ({ children }: { children: React.ReactNode }) => <>{children}</>;

Views.Days = Days;
Views.Months = Months;
Views.Years = Years;
Views.Decades = Decades;

export default Views;
