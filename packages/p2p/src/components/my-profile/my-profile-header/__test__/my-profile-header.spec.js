import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import MyProfileHeader from '../my-profile-header.jsx';

const mockFn = jest.fn();

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        my_profile_store: {
            setActiveTab: jest.fn(() => mockFn()),
            active_tab: 0,
        },
    })),
}));

describe('<MyProfileHeader/>', () => {
    it('should list 3 tabs on component render', () => {
        render(<MyProfileHeader />);

        expect(screen.getAllByRole('button').length).toBe(3);
    });

    it('should trigger setActiveTab funcntion on click on button tabs', () => {
        render(<MyProfileHeader />);
        fireEvent.click(screen.getAllByRole('button')[1]);

        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
