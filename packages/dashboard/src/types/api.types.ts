import { ResidenceList } from '@deriv/api-types';

export type TErrorResponse =
    | {
          message: string;
          code: string;
      }
    | undefined;

export type ResidenceListItem = ResidenceList[0];
