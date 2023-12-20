import { Jurisdiction } from './constants';

export type TBrokerCodes = typeof Jurisdiction[keyof typeof Jurisdiction];
