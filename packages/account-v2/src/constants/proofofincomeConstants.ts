import * as Yup from 'yup';
import { proofOfIncomeUtils } from '../utils/proofOfIncomeUtils';

export const listItems = [
    'The document must be up-to-date and signed by the issuance authority.',
    'The document must contain a letterhead.',
    'Invalid or incomplete documents shall be rejected.',
];
export const documentValidation = Yup.mixed<File>();

export const PoincDocumentsList = proofOfIncomeUtils();
