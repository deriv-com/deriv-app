import React from 'react';
import { render, screen } from '@testing-library/react';
import {
    documentAdditionalError,
    generatePlaceholderText,
    getDocumentData,
    getExampleFormat,
    getRegex,
    isDocumentNumberValid,
    isFieldImmutable,
    preventEmptyClipboardPaste,
    shouldShowIdentityInformation,
    getOnfidoSupportedLocaleCode,
} from '../utils';

describe('generatePlaceholderText', () => {
    it('should return the correct placeholder text for drivers license', () => {
        expect(generatePlaceholderText('drivers_license')).toEqual('Enter Driver License Reference number');
    });

    it('should return the correct placeholder text for ssnit', () => {
        expect(generatePlaceholderText('ssnit')).toEqual('Enter your SSNIT number');
    });

    it('should return the correct placeholder text for id card', () => {
        expect(generatePlaceholderText('id_card')).toEqual('Enter your document number');
    });

    it('should return the correct placeholder text for passport', () => {
        expect(generatePlaceholderText('passport')).toEqual('Enter your document number');
    });
});

describe('documentAdditionalError', () => {
    it('should set the correct additional document error when format is incorrect', () => {
        expect(documentAdditionalError('testdoc', '/[a-z]/')).toEqual('Please enter the correct format. ');
    });

    it('should set the correct additional document error when value is not provided', () => {
        expect(documentAdditionalError('', '/[a-z]+/')).toEqual('Please enter your document number. ');
    });
});

describe('shouldShowIdentityInformation', () => {
    const mock_data = {
        account_status: {
            status: ['skip_idv'],
        },
        account_settings: {
            citizen: 'test',
        },
        residence: 'test',
        residence_list: [
            {
                value: 'test',
                identity: {
                    services: {
                        idv: {
                            is_country_supported: true,
                        },
                    },
                },
            },
        ],
        real_account_signup_target: 'maltainvest',
    };

    it('should not show IDV if the country is maltainvest', () => {
        expect(shouldShowIdentityInformation(mock_data)).toBeFalsy();
    });

    it("should not show IDV if the country dosen't support it", () => {
        const new_mock_data = {
            ...mock_data,
            residence_list: [
                {
                    value: 'test',
                    identity: {
                        services: {
                            idv: {
                                is_country_supported: false,
                            },
                        },
                    },
                },
            ],
            real_account_signup_target: 'svg',
        };
        expect(shouldShowIdentityInformation(new_mock_data)).toBeFalsy();
    });

    it('should show IDV if the country is not maltainvest and supports idv', () => {
        const new_mock_data = {
            ...mock_data,
            account_status: {
                status: [],
            },
            real_account_signup_target: 'svg',
        };
        expect(shouldShowIdentityInformation(new_mock_data)).toBeTruthy();
    });

    it('should not show IDV if the account status has skip_idv status', () => {
        const new_mock_data = {
            ...mock_data,
            real_account_signup_target: 'svg',
        };
        expect(shouldShowIdentityInformation(new_mock_data)).toBeFalsy();
    });
});

describe('getDocumentData', () => {
    it('should return the empty document data', () => {
        expect(getDocumentData('pe', 'national_id')).toEqual({
            example_format: '12345678',
        });
    });

    it('should return correct document data for Zimbabwe', () => {
        expect(getDocumentData('zw', 'national_id')).toEqual({
            new_display_name: 'National ID',
            example_format: '081234567F53',
            sample_image: '/public/images/common/zw_national_identity_card.png',
        });
    });
});

describe('getRegex', () => {
    it('should return the correct regex for Zimbabwe', () => {
        expect(getRegex('^[a-z]+$')).toEqual(/^[a-z]+$/);
    });
});

describe('preventEmptyClipboardPaste', () => {
    it('should not paste any data when clipboard is empty', () => {
        const event = {
            clipboardData: {
                getData: jest.fn(() => ''),
            },
            preventDefault: jest.fn(),
        };
        preventEmptyClipboardPaste(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should not paste any data when clipboard is empty', () => {
        const event = {
            clipboardData: {
                getData: jest.fn(() => 'test string'),
            },
            preventDefault: jest.fn(),
        };
        preventEmptyClipboardPaste(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
    });
});

describe('isFieldImmutable', () => {
    it('should return false if field is mutable', () => {
        const immutable_field_set = ['test1', 'test2'];
        expect(isFieldImmutable('test1', immutable_field_set)).toBeFalsy();
    });

    it('should return true if field is immutable', () => {
        const mutable_field_set = ['test1', 'test2'];
        expect(isFieldImmutable('test3', mutable_field_set)).toBeTruthy();
    });
});

describe('getExampleFormat', () => {
    it('should return the correct example format for Zimbabwe', () => {
        expect(getExampleFormat('081234567F53')).toEqual('Example: 081234567F53');
    });

    it('should return empty string when no example format is provided', () => {
        expect(getExampleFormat('')).toEqual('');
    });
});

describe('isDocumentNumberValid', () => {
    it('should return error message for empty document number, when document_type text Passport', () => {
        const mock_document_type = {
            id: 'passport',
            text: 'Passport',
            example_format: '081234567F53',
        };
        const errorMessage = isDocumentNumberValid('', mock_document_type);
        render(<div>{errorMessage}</div>);
        expect(screen.getByText('Please enter your document number. Example: 081234567F53')).toBeInTheDocument();
    });

    it('should return error message for empty Driver License, when document_type text Drivers License', () => {
        const mock_document_type = {
            id: 'drivers_license',
            text: 'Drivers License',
            example_format: '081234567F53',
        };
        const errorMessage = isDocumentNumberValid('', mock_document_type);
        render(<div>{errorMessage}</div>);
        expect(
            screen.getByText('Please enter your Driver License Reference number. Example: 081234567F53')
        ).toBeInTheDocument();
    });

    it('should return error message for empty SSNIT, when document_type text Social Security and National Insurance Trust', () => {
        const mock_document_type = {
            id: 'ssnit',
            text: 'Social Security and National Insurance Trust',
            example_format: '081234567F53',
        };
        const errorMessage = isDocumentNumberValid('', mock_document_type);
        render(<div>{errorMessage}</div>);
        expect(screen.getByText('Please enter your SSNIT number. Example: 081234567F53')).toBeInTheDocument();
    });

    it('should return Please enter valid ID, when user inputs same with example', () => {
        const mock_document_type = {
            id: 'ssnit',
            text: 'Social Security and National Insurance Trust',
            example_format: '081234567F53',
        };
        const errorMessage = isDocumentNumberValid('081234567F53', mock_document_type);
        expect(errorMessage).toEqual('Please enter a valid ID number.');
    });

    it('should return undefined, when user inputs value correctly', () => {
        const mock_document_type = {
            id: 'ssnit',
            text: 'Social Security and National Insurance Trust',
            example_format: '081234567F53',
        };
        const errorMessage = isDocumentNumberValid('08123456F753', mock_document_type);
        expect(errorMessage).toBeUndefined();
    });
});

describe('getOnfidoSupportedLocaleCode', () => {
    it('should return the correct language tag for German', () => {
        expect(getOnfidoSupportedLocaleCode('DE')).toEqual('de');
    });

    it('should return the correct language tag for Chinese', () => {
        expect(getOnfidoSupportedLocaleCode('Zh_CN')).toEqual('zh_CN');
    });
});
