import { EMPLOYMENT_VALUES, occupationList } from '../constants/financialInformationList';

export const filterOccupationList = (employmentStatus: string) =>
    [EMPLOYMENT_VALUES.employed, EMPLOYMENT_VALUES.selfEmployed].some(val => val === employmentStatus)
        ? occupationList.filter(item => item.value !== EMPLOYMENT_VALUES.unemployed)
        : occupationList;

export const shouldHideOccupation = (employmentStatus: string | undefined) =>
    employmentStatus === EMPLOYMENT_VALUES.unemployed;
