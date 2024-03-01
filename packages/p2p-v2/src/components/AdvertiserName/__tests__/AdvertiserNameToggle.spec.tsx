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
const mockProps = {
    advertiserInfo: {
        fullName: 'Jane Doe',
        show_name: 0,
    },
    onToggle: jest.fn(),
};
const mockUseAdvertiserUpdateMutate = jest.fn();

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
        render(<AdvertiserNameToggle {...mockProps} />, { wrapper });
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
    it('should switch full name settings', () => {
        render(<AdvertiserNameToggle {...mockProps} />, { wrapper });
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
