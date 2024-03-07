import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdvertiserNameToggle from '../AdvertiserNameToggle';

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <AuthProvider>{children}</AuthProvider>
    </APIProvider>
);
let mockUseAdvertiserStats = {
    data: {
        fullName: 'Jane Doe',
        show_name: 0,
    },
    isLoading: true,
};
const mockUseAdvertiserUpdateMutate = jest.fn();

jest.mock('../../../hooks', () => ({
    ...jest.requireActual('../../../hooks'),
    useAdvertiserStats: jest.fn(() => mockUseAdvertiserStats),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    p2p: {
        advertiser: {
            useUpdate: jest.fn(() => ({
                mutate: mockUseAdvertiserUpdateMutate,
            })),
        },
    },
}));

describe('AdvertiserNameToggle', () => {
    it('should render full name in toggle', () => {
        mockUseAdvertiserStats = {
            ...mockUseAdvertiserStats,
            isLoading: true,
        };
        render(<AdvertiserNameToggle />, { wrapper });
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
    it('should switch full name settings', () => {
        mockUseAdvertiserStats = {
            ...mockUseAdvertiserStats,
            isLoading: true,
        };
        render(<AdvertiserNameToggle />, { wrapper });
        const labelBtn = screen.getByRole('checkbox');
        userEvent.click(labelBtn);

        expect(mockUseAdvertiserUpdateMutate).toBeCalledWith({
            show_name: 1,
        });
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        userEvent.click(labelBtn);

        expect(mockUseAdvertiserUpdateMutate).toBeCalledWith({
            show_name: 0,
        });
    });
});
