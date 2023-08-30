import React from 'react';
import { screen, render } from '@testing-library/react';
import MyProfile from '../my-profile';

const mock_store = {
    general_store: {
        advertiser_info: {
            buy_completion_rate: 100,
            buy_orders_amount: 1,
            buy_orders_count: 1,
            buy_time_avg: 80,
            partner_count: 1,
        },
        is_advertiser: false,
        should_show_dp2p_blocked: false,
        setActiveIndex: jest.fn(),
    },
    my_profile_store: {
        error_message: '',
        getSettings: jest.fn(),
        setActiveTab: jest.fn(),
        setShouldShowAddPaymentMethodForm: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/verification/verification.jsx', () => jest.fn(() => <div>Verification</div>));
jest.mock('../my-profile-content', () => jest.fn(() => <div>MyProfileContent</div>));
jest.mock('../my-profile-stats/my-profile-details-container', () =>
    jest.fn(() => <div>MyProfileDetailsContainer</div>)
);
jest.mock('../my-profile-header', () => jest.fn(() => <div>MyProfileHeader</div>));

describe('<MyProfile />', () => {
    it('should show the verification page if is_advertiser is false', () => {
        render(<MyProfile />);

        expect(screen.getByText('Verification')).toBeInTheDocument();
    });
});
