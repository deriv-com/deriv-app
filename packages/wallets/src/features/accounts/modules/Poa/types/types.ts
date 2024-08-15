import { THooks } from '../../../../../types';

export type TAddressDetails = {
    firstLine: THooks.AccountSettings['address_line_1'];
    secondLine: THooks.AccountSettings['address_line_2'];
    stateProvinceLine: THooks.AccountSettings['address_state'];
    townCityLine: THooks.AccountSettings['address_city'];
    zipCodeLine: THooks.AccountSettings['address_postcode'];
};

export type TDocumentSubmission = { poaFile?: File };
