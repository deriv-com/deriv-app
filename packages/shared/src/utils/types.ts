import { EMPLOYMENT_VALUES, Jurisdiction } from './constants';
import { CFD_PLATFORMS } from './platform';

export type TBrokerCodes = typeof Jurisdiction[keyof typeof Jurisdiction];

export type TEmploymentStatus = typeof EMPLOYMENT_VALUES[keyof typeof EMPLOYMENT_VALUES];

export type TCFDPlatforms = typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS];
