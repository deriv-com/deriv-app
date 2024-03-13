import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import AdvertiserName from '../AdvertiserName';

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <AuthProvider>{children}</AuthProvider>
    </APIProvider>
);

const mockProps = {
    advertiserStats: {
        fullName: 'Jane Doe',
        name: 'Jane',
        show_name: 1,
    },
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('AdvertiserName', () => {
    it('should render full name', () => {
        render(<AdvertiserName {...mockProps} />, { wrapper });
        expect(screen.queryByText(/Jane Doe/)).toBeInTheDocument();
    });
});
