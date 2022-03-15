import React from 'react';
import { render, screen} from '@testing-library/react';
import MyProfileHeader from '../my-profile-header.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn().mockImplementation(() => ({
        my_profile_store: {
            setActiveTab: jest.fn(),
            active_tab: 0,
        },
    })),
}));

describe('<MyProfileHeader/>', () => {
    it('should list 3 tabs on component render', () => {
        render(<MyProfileHeader />);

        expect(screen.getAllByRole('button').length).toBe(3);
    });
});
