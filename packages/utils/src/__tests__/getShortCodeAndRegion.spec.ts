import getShortCodeAndRegion from '../getShortCodeAndRegion';

describe('getShortCodeAndRegion', () => {
    const mockAccount = {
        landing_company_short: 'svg',
        market_type: 'synthetic',
        server_info: {
            geolocation: {
                region: 'EU',
                sequence: 1,
            },
        },
    };

    const mockExistedAccounts = [
        {
            landing_company_short: 'svg',
            market_type: 'synthetic',
        },
        {
            landing_company_short: 'svg',
            market_type: 'synthetic',
        },
    ];

    it('should return shortcode and region for non-virtual, non-EU user with multiple SVG accounts', () => {
        const result = getShortCodeAndRegion('VRW123', false, 'us', mockAccount, mockExistedAccounts);
        expect(result).toBe('SVG - EU ');
    });

    it('should return empty string for virtual user', () => {
        const result = getShortCodeAndRegion('VRT123', true, 'us', mockAccount, mockExistedAccounts);
        expect(result).toBe('');
    });

    it('should return empty string for EU user', () => {
        const result = getShortCodeAndRegion('MF123', false, 'it', mockAccount, mockExistedAccounts);
        expect(result).toBe('');
    });

    it('should return shortcode and empty region for non-virtual, non-EU user with single SVG account', () => {
        const result = getShortCodeAndRegion('CRW123', false, 'us', mockAccount, [mockAccount]);
        expect(result).toBe('SVG');
    });

    it('should return empty string for virtual, non-EU user with non-SVG account', () => {
        const nonSvgAccount = {
            landing_company_short: 'labuan',
            market_type: 'financial',
        };
        const result = getShortCodeAndRegion('VRW123', true, 'us', nonSvgAccount, mockExistedAccounts);
        expect(result).toBe('');
    });

    it('should return SVG - for virtual, non-EU user with non-SVG account', () => {
        const nonSvgAccount = {
            landing_company_short: 'svg',
            market_type: 'synthetic',
            server_info: {
                geolocation: {},
            },
        };
        const result = getShortCodeAndRegion('CRW123', false, 'us', nonSvgAccount, mockExistedAccounts);
        expect(result).toBe('SVG - ');
    });
});
