import { regex_checks, TSchema } from '@deriv/shared';
import { transformConfig } from 'Configs/address-details-config';

describe('address-details-config', () => {
    let address_details_config: TSchema;
    beforeEach(() => {
        const account_settings = {
            address_state: 'test',
        };
        address_details_config = {
            address_state: {
                supported_in: ['svg', 'maltainvest'],
                default_value: account_settings.address_state,
                rules: [
                    ['req', 'State is required'],
                    [
                        'regular',
                        'State is not in a proper format',
                        {
                            regex: regex_checks.address_details.address_state,
                        },
                    ],
                ],
            },
        };
    });
    it('should remove the required rule for non-eu clients', () => {
        const transformed_config = transformConfig(address_details_config, 'svg');
        expect(transformed_config.address_state.rules).not.toContainEqual(['req', 'State is required']);
    });
    it('should remove the required rule for eu clients', () => {
        const transformed_config = transformConfig(address_details_config, 'maltainvest');
        expect(transformed_config.address_state.rules).not.toContainEqual(['req', 'State is required']);
    });
});
