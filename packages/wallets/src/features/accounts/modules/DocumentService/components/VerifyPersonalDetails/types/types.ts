import { THooks } from '../../../../../../../types';
import { getFormattedDateString } from '../../../../../../../utils/utils';

export type TVerifyPersonalDetailsValues = {
    arePersonalDetailsVerified?: boolean;
    dateOfBirth?: ReturnType<typeof getFormattedDateString>;
    firstName: THooks.AccountSettings['first_name'];
    lastName: THooks.AccountSettings['last_name'];
};
