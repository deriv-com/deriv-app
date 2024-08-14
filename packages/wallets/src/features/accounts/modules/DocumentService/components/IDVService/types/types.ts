import { THooks } from '../../../../../../../types';

export type TDocumentTypeItem = {
    additional?: TDocumentTypeItem;
    pattern?: string;
    text: string;
    value: string;
};

export type TIDVServiceValues = {
    additionalDocumentNumber?: string;
    documentNumber: string;
    documentType: string;
};

export type TErrorMessageProps = Exclude<THooks.POI['current']['status'], undefined>;
