import { formatIDVFormValues } from '../adapters';

describe('Adapter functions tests', () => {
    it('should return the correct IDV form values', () => {
        const form_data = {
            document_type: { id: 'test' },
            document_additional: 'additional text',
            document_number: '123456789',
        };

        expect(formatIDVFormValues(form_data, 'US')).toEqual({
            document_number: '123456789',
            document_additional: 'additional text',
            document_type: 'test',
            issuing_country: 'US',
        });
    });

    it('should render the correct IDV form values when document type is not applicable', () => {
        const form_data = {
            document_type: { id: 'none' },
            document_additional: '',
            document_number: '123456789',
        };

        expect(formatIDVFormValues(form_data, 'US')).toEqual({
            document_number: 'none',
            document_additional: '',
            document_type: 'none',
            issuing_country: 'US',
        });
    });
});
