import { getQueryKeys } from '../query-utils';

describe('getQueryKeys()', () => {
    it('it should return object without req_id', () => {
        const input_payload = {
            req_id: 1,
            get_account_status: 1,
        };

        const expected_output = {
            get_account_status: 1,
        };

        const [, output] = getQueryKeys('name', input_payload);
        expect(output).toBe(JSON.stringify(expected_output));
    });
    it('it should return ordered props', () => {
        const input_payload = {
            exchange_rates: 1,
            base_currency: 'USD',
            req_id: 1,
        };

        const expected_output = {
            base_currency: 'USD',
            exchange_rates: 1,
        };

        const [, output] = getQueryKeys('name', input_payload);
        expect(output).toBe(JSON.stringify(expected_output));
    });
    it('it should return consistent ordered props even if props are passed in different order', () => {
        const input_payload1 = {
            redirect_uri: 'https://test.example.com/redirect',
            homepage: 'https://test.example.com/',
            scopes: ['read', 'trade'],
            verification_uri: 'https://test.example.com/verify',
            github: 'https://github.com/test_org/app',
            app_register: 1,
            appstore: 'https://itunes.apple.com/test_app',
            googleplay: 'https://play.google.com/store/apps/details?id=test.app',
            name: 'Test Application',
        };

        const input_payload2 = {
            appstore: 'https://itunes.apple.com/test_app',
            redirect_uri: 'https://test.example.com/redirect',
            homepage: 'https://test.example.com/',
            verification_uri: 'https://test.example.com/verify',
            github: 'https://github.com/test_org/app',
            app_register: 1,
            name: 'Test Application',
            scopes: ['read', 'trade'],
            googleplay: 'https://play.google.com/store/apps/details?id=test.app',
        };

        const expected_output = {
            app_register: 1,
            appstore: 'https://itunes.apple.com/test_app',
            github: 'https://github.com/test_org/app',
            googleplay: 'https://play.google.com/store/apps/details?id=test.app',
            homepage: 'https://test.example.com/',
            name: 'Test Application',
            redirect_uri: 'https://test.example.com/redirect',
            scopes: ['read', 'trade'],
            verification_uri: 'https://test.example.com/verify',
        };

        const [, output1] = getQueryKeys('name', input_payload1);
        expect(output1).toBe(JSON.stringify(expected_output));

        const [, output2] = getQueryKeys('name', input_payload2);
        expect(output2).toBe(JSON.stringify(expected_output));
    });

    it('it should return only the name if no props is passed', () => {
        const [name, output1] = getQueryKeys('name');

        expect(name).toBe('name');
        expect(output1).toBeUndefined();
    });
});
