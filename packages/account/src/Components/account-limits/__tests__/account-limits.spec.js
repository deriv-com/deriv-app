import React from 'react';
import { screen, render } from '@testing-library/react';
import AccountLimits from '../account-limits';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Loading: jest.fn(() => 'mockedLoading'),
    };
});

jest.mock('Components/demo-message', () => jest.fn(() => 'mockedDemoMessage'));

describe('<AccountLimits/>', () => {
    const props = {
        currency: 'AUD',
        is_fully_authenticated: true,
        is_switching: false,
        is_virtual: false,
        getLimits: jest.fn(() => Promise.resolve({ data: {} })),
        account_limits: {
            account_balance: 300000,
            daily_transfers: {
                dxtrade: {
                    allowed: 12,
                    available: 12,
                },
                internal: {
                    allowed: 10,
                    available: 10,
                },
                mt5: {
                    allowed: 10,
                    available: 10,
                },
            },
            lifetime_limit: 13907.43,
            market_specific: {
                commodities: [
                    {
                        name: 'Commodities',
                        payout_limit: 5000,
                        profile_name: 'moderate_risk',
                        turnover_limit: 50000,
                    },
                ],
                cryptocurrency: [
                    {
                        name: 'Cryptocurrencies',
                        payout_limit: '100.00',
                        profile_name: 'extreme_risk',
                        turnover_limit: '1000.00',
                    },
                ],
                forex: [
                    {
                        name: 'Smart FX',
                        payout_limit: 5000,
                        profile_name: 'moderate_risk',
                        turnover_limit: 50000,
                    },
                    {
                        name: 'Major Pairs',
                        payout_limit: 20000,
                        profile_name: 'medium_risk',
                        turnover_limit: 100000,
                    },
                    {
                        name: 'Minor Pairs',
                        payout_limit: 5000,
                        profile_name: 'moderate_risk',
                        turnover_limit: 50000,
                    },
                ],
                indices: [
                    {
                        name: 'Stock Indices',
                        payout_limit: 20000,
                        profile_name: 'medium_risk',
                        turnover_limit: 100000,
                    },
                ],
                synthetic_index: [
                    {
                        name: 'Synthetic Indices',
                        payout_limit: 50000,
                        profile_name: 'low_risk',
                        turnover_limit: 500000,
                    },
                ],
            },
            num_of_days: 30,
            num_of_days_limit: 13907.43,
            open_positions: 100,
            payout: 50000,
            remainder: 13907.43,
            withdrawal_for_x_days_monetary: 0,
            withdrawal_since_inception_monetary: 0,
        },
    };

    it('should render the Loading component if is_switching is true', () => {
        render(<AccountLimits {...props} is_switching />);
        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
    });

    it('should render AccountLimits component', () => {
        render(<AccountLimits {...props} />);
        expect(screen.queryByTestId('account_limits_data')).toBeInTheDocument();
    });
});
