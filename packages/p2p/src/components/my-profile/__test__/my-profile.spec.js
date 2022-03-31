import React from 'react';
import { useStores } from 'Stores';
import { render, screen } from '@testing-library/react';
import MyProfile from '../my-profile.jsx';

const mock_profile_store = {
    getSettings: jest.fn(),
    getAdvertiserInfo: jest.fn(),
    setActiveTab: jest.fn(),
    error_message: null,
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({ my_profile_store: mock_profile_store })),
}));

jest.mock('Components/my-profile/my-profile-content.jsx', () => jest.fn(() => <div>My Profile Content</div>));

jest.mock('Components/my-profile/my-profile-stats/my-profile-details-container/my-profile-details-container.jsx', () =>
    jest.fn(() => <div>My Profile Details Container</div>)
);

jest.mock('Components/my-profile/my-profile-header/my-profile-header.jsx', () =>
    jest.fn(() => <div>My Profile Header</div>)
);

describe('<MyProfile/>', () => {
    it('should render the component contining Profile header and content', () => {
        render(<MyProfile />);

        expect(screen.getByText('My Profile Content')).toBeInTheDocument();
        expect(screen.getByText('My Profile Header')).toBeInTheDocument();
    });

    it('should render the error component when error_message flag is set', () => {
        useStores.mockImplementation(() => ({
            my_profile_store: { ...mock_profile_store, error_message: 'Some Error' },
        }));
        render(<MyProfile />);

        expect(screen.getByText('Some Error')).toBeInTheDocument();
        expect(screen.queryByText('My Profile Content')).not.toBeInTheDocument();
    });
});
