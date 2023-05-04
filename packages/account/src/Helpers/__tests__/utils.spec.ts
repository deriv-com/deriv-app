import {
    generatePlaceholderText,
    documentAdditionalError,
    shouldShowIdentityInformation,
    getDocumentData,
    getRegex,
    preventEmptyClipboardPaste,
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
        expect(getDocumentData('test', 'test')).toEqual({
            new_display_name: '',
            example_format: '',
            sample_image: '',
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
        expect(getRegex('^[0-9]{8,9}[a-zA-Z]{1}[0-9]{2}$')).toEqual(/^[0-9]{8,9}[a-zA-Z]{1}[0-9]{2}$/);
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
