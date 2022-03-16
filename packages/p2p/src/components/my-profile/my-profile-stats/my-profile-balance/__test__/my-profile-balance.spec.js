import React from 'react';
import { useUpdatingAvailableBalance } from 'Components/hooks';
import { render, screen } from '@testing-library/react';
import MyProfileBalance from '../my-profile-balance.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        general_store: {
            client: {
                currency: 'XYZ',
            },
        },
        my_profile_store: {
            advertiser_info: {
                balance_available: '123',
            },
        },
    })),
}));

jest.mock('Components/hooks', () => ({
    ...jest.requireActual('Components/hooks'),
    useUpdatingAvailableBalance: jest.fn(),
}));

describe('<MyProfileBalance/>', () => {
    it('should render the messages on load', () => {
        render(<MyProfileBalance />);
        expect(screen.getByText('Available Deriv P2P balance')).toBeInTheDocument();
    });

    it('should invoke update balance with value from store', () => {
        render(<MyProfileBalance />);

        expect(useUpdatingAvailableBalance).toHaveBeenCalledWith('123');
    });
});
