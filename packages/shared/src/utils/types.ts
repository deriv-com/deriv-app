import { EMPLOYMENT_VALUES, Jurisdiction } from './constants';

export type TBrokerCodes = typeof Jurisdiction[keyof typeof Jurisdiction];

export type TEmploymentStatus = typeof EMPLOYMENT_VALUES[keyof typeof EMPLOYMENT_VALUES];
