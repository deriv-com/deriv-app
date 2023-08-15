import useAvailableMT5Accounts from '../useAvailableMT5Accounts';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(name => {
        if (name === 'trading_platform_available_accounts') {
            return {
                data: {
                    trading_platform_available_accounts: [
                        {
                            availability: 'Non-EU',
                            icon: 'Derived',
                            market_type: 'gaming',
                            name: 'Deriv SVG',
                            platform: 'mt5',
                            shortcode: 'svg',
                        },
                        {
                            availability: 'Non-EU',
                            icon: 'Derived',
                            market_type: 'gaming',
                            name: 'Deriv SVG',
                            platform: 'mt5',
                            shortcode: 'vanuatu',
                        },
                    ],
                },
            };
        }
        return { data: undefined };
    }),
}));

describe('useAvailableMT5Accounts', () => {
    it('should return available mt5 accounts', () => {
        const { result } = renderHook(() => useAvailableMT5Accounts());

        expect(result.current).toEqual({
            data: {
                gaming: [
                    {
                        availability: 'Non-EU',
                        icon: 'Derived',
                        market_type: 'gaming',
                        name: 'Deriv SVG',
                        platform: 'mt5',
                        shortcode: 'svg',
                    },
                    {
                        availability: 'Non-EU',
                        icon: 'Derived',
                        market_type: 'gaming',
                        name: 'Deriv SVG',
                        platform: 'mt5',
                        shortcode: 'vanuatu',
                    },
                ],
            },
        });
    });
});
