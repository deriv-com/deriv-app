import React from 'react';
import { MY_ADS_URL } from '@/constants';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyAdsEmpty from '../MyAdsEmpty';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isMobile: false,
    }),
}));

const mockFn = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockFn,
    }),
}));

describe('MyAdsEmpty', () => {
    it('should render the empty ads section as expected', () => {
        render(<MyAdsEmpty />);
        expect(screen.getByText('You have no ads 😞')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create new ad' })).toBeInTheDocument();
    });
    it('should handle onClick for create new ad button', () => {
        render(<MyAdsEmpty />);
        const createNewAdButton = screen.getByRole('button', { name: 'Create new ad' });
        userEvent.click(createNewAdButton);
        expect(mockFn).toHaveBeenCalledWith(`${MY_ADS_URL}/create`);
    });
});
