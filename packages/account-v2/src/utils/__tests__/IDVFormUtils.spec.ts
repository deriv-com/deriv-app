import { getIDVFormValidationSchema, getSelectedDocumentConfigData } from '../idvFormUtils';

const DOCUMENT_LIST = [
    {
        additional: {
            display_name: 'PAN Card',
            example_format: 'ABCDE1234F',
            format: '^[a-zA-Z]{5}\\d{4}[a-zA-Z]{1}$',
        },
        example_format: '123456789012',
        id: 'aadhaar',
        text: 'Aadhaar Card',
        value: '^[0-9]{12}$',
    },
    {
        example_format: 'AB1234567890123',
        id: 'drivers_license',
        text: 'Drivers License',
        value: '^[a-zA-Z0-9]{10,17}$',
    },
    {
        example_format: 'ABC1234567',
        id: 'epic',
        text: 'Voter ID',
        value: '^[a-zA-Z]{3}[0-9]{7}$',
    },
];

describe('getSelectedDocumentConfigData', () => {
    it('should return undefined if list is empty', () => {
        expect(getSelectedDocumentConfigData('passport', DOCUMENT_LIST)).toBeUndefined();
    });

    it('should return document congfig if document type is matched', () => {
        expect(getSelectedDocumentConfigData('epic', DOCUMENT_LIST)).toEqual(DOCUMENT_LIST[2]);
    });
});

describe('getIDVFormValidationSchema', () => {
    it('should return return true when data matches schema', async () => {
        const schema = getIDVFormValidationSchema(DOCUMENT_LIST);

        const result = await schema.isValid({
            document_additional: 'hompl7358z',
            document_number: '123456789011',
            document_type: 'aadhaar',
        });

        expect(result).toBeTruthy();
    });

    it('should return false when data fails to match schema', async () => {
        const schema = getIDVFormValidationSchema(DOCUMENT_LIST);

        const result = await schema.isValid({
            document_number: 'Abc123456',
            document_type: 'epic',
        });

        expect(result).toBeFalsy();
    });
});
