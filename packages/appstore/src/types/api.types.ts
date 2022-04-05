import { ResidenceList, Authorize } from '@deriv/api-types';

export type TErrorResponse =
    | {
          message: string;
          code: string;
      }
    | undefined;

export type ResidenceListItem = ResidenceList[0];

export type TAccountList = Authorize['account_list'];
