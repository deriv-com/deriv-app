import React from 'react';
import { useStores } from 'Stores';
import { render, screen } from '@testing-library/react';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import MyProfileContent from '../my-profile-content.jsx';

const mock_profile_store = {
    getSettings: jest.fn(),
    getAdvertiserInfo: jest.fn(),
    setActiveTab: jest.fn(),
    is_loading: false,
    active_tab: my_profile_tabs.AD_TEMPLATE,
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({ my_profile_store: mock_profile_store })),
}));

jest.mock('@deriv/components', () => ({
    Loading: jest.fn(() => <div>Loading</div>),
}));

jest.mock('Components/my-profile/my-profile-form/my-profile-form.jsx', () => jest.fn(() => <div>My Profile Form</div>));

jest.mock('Components/my-profile/my-profile-stats/my-profile-stats.jsx', () =>
    jest.fn(() => <div>My Profile Stats</div>)
);

jest.mock('Components/my-profile/payment-methods/payment-methods.jsx', () => jest.fn(() => <div>Payment methods</div>));

describe('<MyProfileContent/>', () => {
    it('should render Profile Form', () => {
        render(<MyProfileContent />);

        expect(screen.getByText('My Profile Form')).toBeInTheDocument();
    });

    it('should render Payment methods', () => {
        useStores.mockImplementation(() => ({
            my_profile_store: { ...mock_profile_store, active_tab: my_profile_tabs.PAYMENT_METHODS },
        }));
        render(<MyProfileContent />);

        expect(screen.getByText('Payment methods')).toBeInTheDocument();
    });

    it('should render Profile status screen for any other non mathching values',()=>{
        useStores.mockImplementation(() => ({
            my_profile_store: { ...mock_profile_store, active_tab: 'stat'},
        }));
        render(<MyProfileContent />);

        expect(screen.getByText('My Profile Stats')).toBeInTheDocument();
    })

    it('should render loading screen', () => {
        useStores.mockImplementation(() => ({
            my_profile_store: { ...mock_profile_store, is_loading: true },
        }));
        render(<MyProfileContent />);

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });
});
