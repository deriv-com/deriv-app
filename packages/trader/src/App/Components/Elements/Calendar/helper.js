import { toMoment } from 'Utils/Date';

export const getDecade = (moment_date) => `${toMoment(moment_date).year()}-${toMoment(moment_date).add(9, 'years').year()}`;

export const getCentury = (moment_date) => `${toMoment(moment_date).year()}-${toMoment(moment_date).add(99, 'years').year()}`;
