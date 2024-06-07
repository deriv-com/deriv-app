import { getIDVFormValidationSchema, getSelectedDocumentConfigData } from '../idvFormUtils';

const mockDocumentConfig = [
    {
        additional: {
            displayName: 'PAN Card',
            exampleFormat: 'ABCDE1234F',
            format: '^[a-zA-Z]{5}\\d{4}[a-zA-Z]{1}$',
        },
        exampleFormat: '123456789012',
        id: 'aadhaar',
        text: 'Aadhaar Card',
        value: '^[0-9]{12}$',
    },
    {
        exampleFormat: 'AB1234567890123',
        id: 'drivers_license',
        text: 'Drivers License',
        value: '^[a-zA-Z0-9]{10,17}$',
    },
    {
        exampleFormat: 'ABC1234567',
        id: 'epic',
        text: 'Voter ID',
        value: '^[a-zA-Z]{3}[0-9]{7}$',
    },
];

const mockDocumentList = {
    aadhaar: {
        additional: {
            display_name: 'PAN Card',
            format: '^[a-zA-Z]{5}d{4}[a-zA-Z]{1}$',
        },
        display_name: 'Aadhaar Card',
        format: '^[0-9]{12}$',
    },
    drivers_license: {
        display_name: 'Drivers License',
        format: '^[a-zA-Z0-9]{10,17}$',
    },
    epic: {
        display_name: 'Voter ID',
        format: '^[a-zA-Z]{3}[0-9]{7}$',
    },
};

describe('getSelectedDocumentConfigData', () => {
    it('should return undefined if list is empty', () => {
        expect(getSelectedDocumentConfigData('in', 'passport', mockDocumentList)).toBeUndefined();
    });

    it('should return document congfig if document type is matched', () => {
        expect(getSelectedDocumentConfigData('in', 'epic', mockDocumentList)).toEqual(mockDocumentConfig[2]);
    });
});

describe('getIDVFormValidationSchema', () => {
    it('should return return true when data matches schema', async () => {
        const schema = getIDVFormValidationSchema('in', mockDocumentList, {});

        const result = await schema.isValid({
            additionalDocument: 'hompl7358z',
            documentNumber: '123456789011',
            documentType: 'aadhaar',
        });

        expect(result).toBeTruthy();
    });

    it('should return false when data fails to match schema', async () => {
        const schema = getIDVFormValidationSchema('in', mockDocumentList, {});

        const result = await schema.isValid({
            documentNumber: 'Abc123456',
            documentType: 'epic',
        });

        expect(result).toBeFalsy();
    });
});
