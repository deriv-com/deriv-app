import { GetSettings, ResidenceList } from '@deriv/api-types';
import { getFormFieldsConfig, getFormConfig, TFields } from '../form-config';

const mockAccountSettings: GetSettings = {
    immutable_fields: ['place_of_birth'],
    place_of_birth: 'UK',
    tax_residence: 'UK',
    tax_identification_number: '12345',
    account_opening_reason: 'Hedging',
};

const mockResidenceList: ResidenceList = [
    { value: 'UK', text: 'United Kingdom' },
    { value: 'US', text: 'United States' },
];

describe('getFormFieldsConfig', () => {
    it('should return the correct form fields configuration', () => {
        const requiredFields: TFields[] = ['place_of_birth', 'tax_residence'];
        const config = getFormFieldsConfig(mockAccountSettings, mockResidenceList, requiredFields);

        expect(config.place_of_birth.type).toBe('select');
        expect(config.place_of_birth.initial_value).toBe('United Kingdom');
        expect(config.place_of_birth.disabled).toBe(true);
        expect(config.place_of_birth.required).toBe(true);

        expect(config.tax_residence.type).toBe('select');
        expect(config.tax_residence.initial_value).toBe('United Kingdom');
        expect(config.tax_residence.disabled).toBe(false);
        expect(config.tax_residence.required).toBe(true);
    });
});

describe('getFormConfig', () => {
    it('should return the correct form configuration', () => {
        const requiredFields: TFields[] = ['place_of_birth', 'tax_residence'];
        const formConfig = getFormConfig({
            account_settings: mockAccountSettings,
            residence_list: mockResidenceList,
            required_fields: requiredFields,
        });

        expect(formConfig.fields.place_of_birth.disabled).toBe(true);
        expect(formConfig.fields.place_of_birth.required).toBe(true);

        expect(formConfig.fields.tax_residence.disabled).toBe(false);
        expect(formConfig.fields.tax_residence.required).toBe(true);
    });

    it('should return the correct form configuration with input types', () => {
        const requiredFields: TFields[] = ['place_of_birth', 'tax_residence'];
        const formConfig = getFormConfig({
            account_settings: { ...mockAccountSettings, immutable_fields: ['place_of_birth', 'tax_residence'] },
            residence_list: mockResidenceList,
            required_fields: requiredFields,
            with_input_types: true,
        });

        expect(formConfig.fields.place_of_birth.type).toBe('select');
        expect(formConfig.fields.place_of_birth.disabled).toBe(true);
        expect(formConfig.fields.place_of_birth.required).toBe(true);

        expect(formConfig.fields.tax_residence.type).toBe('select');
        expect(formConfig.fields.tax_residence.disabled).toBe(true);
        expect(formConfig.fields.tax_residence.required).toBe(true);
    });
});
