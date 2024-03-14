import { getIDVFormValidationSchema, getSelectedDocumentConfigData } from '../idvFormUtils';

const mockDocumentList = [
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
        expect(getSelectedDocumentConfigData('passport', mockDocumentList)).toBeUndefined();
    });

    it('should return document congfig if document type is matched', () => {
        expect(getSelectedDocumentConfigData('epic', mockDocumentList)).toEqual(mockDocumentList[2]);
    });
});

describe('getIDVFormValidationSchema', () => {
    it('should return return true when data matches schema', async () => {
        const schema = getIDVFormValidationSchema(mockDocumentList);

        const result = await schema.isValid({
            additionalDocument: 'hompl7358z',
            documentNumber: '123456789011',
            documentType: 'aadhaar',
        });

        expect(result).toBeTruthy();
    });

    it('should return false when data fails to match schema', async () => {
        const schema = getIDVFormValidationSchema(mockDocumentList);

        const result = await schema.isValid({
            documentNumber: 'Abc123456',
            documentType: 'epic',
        });

        expect(result).toBeFalsy();
    });
});
