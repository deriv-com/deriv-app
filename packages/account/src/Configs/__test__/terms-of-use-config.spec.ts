import termsOfUseConfig from '../terms-of-use-config';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getDefaultFields: jest.fn(),
}));

describe('terms-of-use-config', () => {
    const MockComponent = jest.fn();

    it('should set the is_multi_account value to true', () => {
        const account_settings = {
            fatca_declaration: 0,
        };
        const config = termsOfUseConfig(
            {
                real_account_signup_target: 'maltainvest',
                account_settings,
            },
            // @ts-expect-error mock component
            MockComponent
        );
        expect(config.props.is_multi_account).toBeTruthy();
    });

    it('should set the is_multi_account value to false', () => {
        const account_settings = {};
        const config = termsOfUseConfig(
            {
                real_account_signup_target: 'maltainvest',
                account_settings,
            },
            // @ts-expect-error mock component
            MockComponent
        );
        expect(config.props.is_multi_account).toBeFalsy();
    });
});
