import { getFilteredCountryList } from '../ad-utils';

describe('ad-utils', () => {
    describe('getFilteredCountryList', () => {
        it('should return an empty object with empty country list', () => {
            const countryList = {};
            const result = getFilteredCountryList(countryList);
            expect(result).toEqual({});
        });
        it('should return the filtered country list based on the payment methods availability', () => {
            const mockCountryList = {
                countryA: {
                    country_name: 'countryA',
                    cross_border_ads_enabled: 1,
                    fixed_rate_adverts: 'enabled',
                    float_rate_adverts: 'disabled',
                    float_rate_offset_limit: 10,
                    local_currency: 'CA',
                    payment_methods: {
                        alipay: {
                            display_name: 'Alipay',
                            fields: {
                                account: {
                                    display_name: 'Alipay ID',
                                    required: 1,
                                    type: 'text',
                                },
                                instructions: {
                                    display_name: 'Instructions',
                                    required: 0,
                                    type: 'memo',
                                },
                            },
                            type: 'ewallet',
                        },
                    },
                },
                countryB: {
                    country_name: 'countryB',
                    cross_border_ads_enabled: 1,
                    fixed_rate_adverts: 'enabled',
                    float_rate_adverts: 'disabled',
                    float_rate_offset_limit: 10,
                    local_currency: 'CB',
                    payment_methods: {
                        bank_transfer: {
                            display_name: 'Bank Transfer',
                            fields: {
                                account: {
                                    display_name: 'Bank Account',
                                    required: 1,
                                    type: 'text',
                                },
                                instructions: {
                                    display_name: 'Instructions',
                                    required: 0,
                                    type: 'memo',
                                },
                            },
                            type: 'other',
                        },
                    },
                },
            };

            const expectedResult = {
                countryB: { ...mockCountryList.countryB },
            };

            const result = getFilteredCountryList(mockCountryList, ['bank_transfer']);
            expect(result).toEqual(expectedResult);
        });
    });
});
