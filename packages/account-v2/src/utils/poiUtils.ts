import { POI_SUBMISSION_STATUS } from '../constants';

type TPOISubmissionStatus = typeof POI_SUBMISSION_STATUS[keyof typeof POI_SUBMISSION_STATUS];

export type TPOIActions =
    | { payload: string; type: 'setSelectedCountry' }
    | { payload: TPOISubmissionStatus; type: 'setSubmissionStatus' };
