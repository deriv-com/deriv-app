import { EMPLOYMENT_VALUES, occupationList } from '../constants/financialInformationList';

export const filterOccupationList = (employmentStatus: string) =>
    employmentStatus === EMPLOYMENT_VALUES.employed
        ? occupationList.filter(item => item.value !== EMPLOYMENT_VALUES.unemployed)
        : occupationList;

export const shouldHideOccupation = (employmentStatus: string) =>
    [EMPLOYMENT_VALUES.selfEmployed, EMPLOYMENT_VALUES.unemployed].some(val => val === employmentStatus);
