import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import AdvertiserName from '../AdvertiserName';

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <AuthProvider>{children}</AuthProvider>
    </APIProvider>
);
let mockUseAdvertiserStats = {
    data: {
        fullName: 'Jane Doe',
        name: 'Jane',
        show_name: 0,
    },
    isLoading: false,
};

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    useAdvertiserStats: jest.fn(() => mockUseAdvertiserStats),
}));

describe('AdvertiserNameStats', () => {
    it('should render full name', () => {
        mockUseAdvertiserStats = {
            data: {
                ...mockUseAdvertiserStats.data,
                show_name: 1,
            },
            isLoading: false,
        };
        render(<AdvertiserName />, { wrapper });
        expect(screen.queryByText('Jane Doe')).toBeInTheDocument();
    });
});
